import { beforeEach, describe, expect, test } from 'bun:test'
import useGame from './useGame'

const startGame = (...names) => {
  useGame.getState().reset()
  names.forEach((name) => useGame.getState().addPlayer(name))
  return useGame.getState().getActivePlayers()
}

const completeRound = (winnerId, scoresByPlayerId, round) => {
  const { addScore } = useGame.getState()
  addScore({ playerId: winnerId, isWinner: true, round })
  Object.entries(scoresByPlayerId).forEach(([playerId, score]) => {
    addScore({ playerId, score, round })
  })
}

beforeEach(() => {
  localStorage.clear()
  useGame.getState().reset()
})

describe('dealer', () => {
  test('follows round number among active players', () => {
    startGame('Alice', 'Bob', 'Carol')

    expect(useGame.getState().getDealer(1).name).toBe('Alice')
    expect(useGame.getState().getDealer(2).name).toBe('Bob')
    expect(useGame.getState().getDealer(3).name).toBe('Carol')
    expect(useGame.getState().getDealer(4).name).toBe('Alice')
  })

  test('uses the requested round, not only the current round', () => {
    startGame('Alice', 'Bob', 'Carol')
    useGame.getState().selectNextRound(2)

    expect(useGame.getState().currentRound).toBe(2)
    expect(useGame.getState().getDealer().name).toBe('Bob')
    expect(useGame.getState().getDealer(4).name).toBe('Alice')
  })
})

describe('round selection', () => {
  test('skipping rounds marks the gap and keeps dealer in sync', () => {
    startGame('Alice', 'Bob', 'Carol')

    expect(useGame.getState().selectNextRound(5)).toBe(5)
    expect(useGame.getState().skippedRounds).toEqual([1, 2, 3, 4])
    expect(useGame.getState().getDealer().name).toBe('Bob')
    expect(useGame.getState().getUnplayedRounds()).toEqual([5, 6, 7, 8])
    expect(useGame.getState().getNextPlayableRound(1)).toBe(5)
  })

  test('does not skip a round that already has scores', () => {
    const [alice, bob, carol] = startGame('Alice', 'Bob', 'Carol')
    completeRound(alice.id, { [bob.id]: 10, [carol.id]: 15 }, 1)
    useGame.getState().advanceRound()

    expect(useGame.getState().selectNextRound(4)).toBe(4)
    expect(useGame.getState().skippedRounds).toEqual([2, 3])
  })
})

describe('scoring', () => {
  test('winner takes the absolute total of the other scores', () => {
    const [alice, bob, carol] = startGame('Alice', 'Bob', 'Carol')
    completeRound(alice.id, { [bob.id]: 10, [carol.id]: 15 }, 1)

    const roundScores = useGame.getState().getRoundScores(1)
    expect(roundScores.find((entry) => entry.playerId === alice.id)).toEqual({
      round: 1,
      playerId: alice.id,
      score: 25,
      isWinner: true,
    })
    expect(roundScores.find((entry) => entry.playerId === bob.id).score).toBe(-10)
    expect(useGame.getState().getRoundScoresComplete(1)).toBe(true)
  })

  test('re-picking a winner leaves the previous winner needing a score', () => {
    const [alice, bob, carol] = startGame('Alice', 'Bob', 'Carol')
    useGame.getState().addScore({ playerId: alice.id, isWinner: true, round: 1 })
    useGame.getState().addScore({ playerId: bob.id, isWinner: true, round: 1 })

    const demoted = useGame.getState().getRoundScores(1).find((entry) => entry.playerId === alice.id)
    expect(demoted).toEqual({
      round: 1,
      playerId: alice.id,
      score: null,
      isWinner: false,
    })
    expect(useGame.getState().getRoundWinner(1).playerId).toBe(bob.id)
    expect(useGame.getState().getRoundScoresComplete(1)).toBe(false)

    useGame.getState().addScore({ playerId: alice.id, score: 20, round: 1 })
    useGame.getState().addScore({ playerId: carol.id, score: 10, round: 1 })
    expect(useGame.getState().getRoundScoresComplete(1)).toBe(true)
    expect(useGame.getState().getRoundScores(1).find((entry) => entry.playerId === bob.id).score).toBe(30)
  })

  test('a dropped player who already scored does not freeze the round', () => {
    const [alice, bob, carol] = startGame('Alice', 'Bob', 'Carol')
    completeRound(alice.id, { [bob.id]: 10, [carol.id]: 15 }, 1)
    useGame.getState().deletePlayer(carol.id)

    expect(useGame.getState().getPlayer(carol.id).active).toBe(false)
    expect(useGame.getState().getRoundScoresComplete(1)).toBe(true)
    expect(useGame.getState().advanceRound()).toBe(2)
    expect(useGame.getState().getDealer().name).toBe('Bob')
  })

  test('does not advance until the current round is complete', () => {
    const warn = console.warn
    console.warn = () => {}
    try {
      const [alice] = startGame('Alice', 'Bob', 'Carol')
      useGame.getState().addScore({ playerId: alice.id, isWinner: true, round: 1 })

      expect(useGame.getState().advanceRound()).toBe(1)
      expect(useGame.getState().currentRound).toBe(1)
    } finally {
      console.warn = warn
    }
  })
})

describe('standings and replay', () => {
  test('standings ignore placeholder scores and rank by total', () => {
    const [alice, bob, carol] = startGame('Alice', 'Bob', 'Carol')
    completeRound(alice.id, { [bob.id]: 10, [carol.id]: 20 }, 1)
    useGame.getState().advanceRound()
    completeRound(bob.id, { [alice.id]: 5, [carol.id]: 15 }, 2)

    const standings = useGame.getState().getStandings(2)
    expect(standings.map((row) => row.player)).toEqual(['Alice', 'Bob', 'Carol'])
    expect(standings[0]).toMatchObject({ player: 'Alice', score: 25, wins: 1, isWinner: true })
    expect(standings[1]).toMatchObject({ player: 'Bob', score: 10, wins: 1, isWinner: false })
    expect(standings[2]).toMatchObject({ player: 'Carol', score: -35, wins: 0, isWinner: false })
  })

  test('play again keeps players and restarts at round 1', () => {
    const [alice, bob, carol] = startGame('Alice', 'Bob', 'Carol')
    completeRound(alice.id, { [bob.id]: 10, [carol.id]: 15 }, 1)
    useGame.getState().advanceRound()
    useGame.getState().playAgain()

    expect(useGame.getState().currentRound).toBe(1)
    expect(useGame.getState().scores).toEqual([])
    expect(useGame.getState().skippedRounds).toEqual([])
    expect(useGame.getState().getActivePlayers().map((player) => player.name)).toEqual(['Alice', 'Bob', 'Carol'])
    expect(useGame.getState().getDealer().name).toBe('Alice')
    expect(useGame.getState().getGameComplete()).toBe(false)
  })
})
