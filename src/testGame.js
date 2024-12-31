// Import the store
import useGameStore from './gameStore'

const testGameStore = () => {
  const {
    addPlayer,
    addScore,
    advanceRound,
    getStandings,
  } = useGameStore.getState()

  // Add 5 players
  const players = ["Alice", "Bob", "Charlie", "David", "Eve"]
  players.forEach(name => addPlayer(name))

  // Test data for 8 rounds - each sub-array represents [playerIndex, score]
  // The winner is always the last entry in each round and doesn't need a score
  const roundData = [
    // Round 1: Alice wins
    [
      { playerIndex: 1, score: 50 },
      { playerIndex: 2, score: 30 },
      { playerIndex: 3, score: 20 },
      { playerIndex: 4, score: 40 },
      { playerIndex: 0, isWinner: true }
    ],
    // Round 2: Bob wins
    [
      { playerIndex: 0, score: 45 },
      { playerIndex: 2, score: 25 },
      { playerIndex: 3, score: 35 },
      { playerIndex: 4, score: 30 },
      { playerIndex: 1, isWinner: true }
    ],
    // Round 3: Charlie wins
    [
      { playerIndex: 0, score: 30 },
      { playerIndex: 1, score: 40 },
      { playerIndex: 3, score: 25 },
      { playerIndex: 4, score: 20 },
      { playerIndex: 2, isWinner: true }
    ],
    // Round 4: David wins
    [
      { playerIndex: 0, score: 35 },
      { playerIndex: 1, score: 25 },
      { playerIndex: 2, score: 40 },
      { playerIndex: 4, score: 30 },
      { playerIndex: 3, isWinner: true }
    ],
    // Round 5: Eve wins
    [
      { playerIndex: 0, score: 20 },
      { playerIndex: 1, score: 35 },
      { playerIndex: 2, score: 30 },
      { playerIndex: 3, score: 40 },
      { playerIndex: 4, isWinner: true }
    ],
    // Round 6: Alice wins again
    [
      { playerIndex: 1, score: 30 },
      { playerIndex: 2, score: 45 },
      { playerIndex: 3, score: 25 },
      { playerIndex: 4, score: 35 },
      { playerIndex: 0, isWinner: true }
    ],
    // Round 7: Bob wins again
    [
      { playerIndex: 0, score: 40 },
      { playerIndex: 2, score: 30 },
      { playerIndex: 3, score: 35 },
      { playerIndex: 4, score: 25 },
      { playerIndex: 1, isWinner: true }
    ],
    // Round 8: Charlie wins again
    [
      { playerIndex: 0, score: 25 },
      { playerIndex: 1, score: 35 },
      { playerIndex: 3, score: 30 },
      { playerIndex: 4, score: 40 },
      { playerIndex: 2, isWinner: true }
    ]
  ]

  // Play through all rounds
  roundData.forEach((round) => {
    console.log(`\nRound ${useGameStore.getState().currentRound}:`)

    // Add scores for this round
    round.forEach(scoreData => {
      addScore(scoreData)
    })

    // Get and log standings after this round
    const standings = getStandings()
    console.log('\nStandings after round', useGameStore.getState().currentRound)
    standings.forEach(({ playerIndex, totalScore, wins }) => {
      console.log(`${players[playerIndex]}: ${totalScore} points, ${wins} wins`)
    })

    // Advance to next round
    advanceRound()
  })

  // Log final standings
  console.log('\nFINAL STANDINGS:')
  const finalStandings = getStandings()
  finalStandings.forEach(({ playerIndex, totalScore, wins }) => {
    console.log(`${players[playerIndex]}: ${totalScore} points, ${wins} wins`)
  })
}

// Run the test
testGameStore()
