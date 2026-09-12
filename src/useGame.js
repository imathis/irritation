import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getDealerForRound, getNextRoundNumber } from './helpers'

const initializeGame = (opts = {}) => ({
  players: [],
  currentRound: 1,
  finalRound: 8,
  skippedRounds: [],
  scores: [],
  updatedAt: new Date(),
  ...opts,
})

const useGameStore = create(persist((set, get) => ({
  ...initializeGame(),

  addPlayer: (name) => {
    const id = `id${Math.random().toString(16).slice(2)}`
    set((state) => ({
      players: [...state.players, { id, name, active: true }],
      updatedAt: new Date(),
    }))
  },

  updatePlayer: (id, name) => {
    set((state) => ({
      players: state.players.map((player) =>
        id === player.id ? { ...player, name } : player
      ),
      updatedAt: new Date(),
    }))
  },

  deletePlayer: (id) => {
    set((state) => {
      // If a player has a score, removing the player simply makes them inactive.
      if (state.scores.find((s) => s.playerId === id)) {
        return ({
          players: state.players.map((player) => player.id === id ? ({ ...player, active: false }) : player),
          updatedAt: new Date(),
        })
      }
      // Remove the player from the list
      return ({
        players: state.players.filter((player) => player.id !== id),
        updatedAt: new Date(),
      })
    })
  },

  getActivePlayers: () => {
    const { players } = get()
    return players.filter(({ active }) => active)
  },

  getPlayer: (id) => {
    const { players } = get()
    return players.find((p) => p.id === id)
  },

  addScore: ({ playerId, score, isWinner = false, round = null }) => {
    set((state) => {
      const targetRound = round ?? state.currentRound

      if (!state.players.find(({ id }) => id === playerId)) {
        console.error('Player not found')
        return state
      }

      let updatedScores = state.scores

      if (isWinner) {
        updatedScores = updatedScores.map((entry) => {
          if (entry.round === targetRound && entry.isWinner && entry.playerId !== playerId) {
            return { ...entry, isWinner: false, score: null }
          }
          return entry
        })
      }

      updatedScores = updatedScores.filter((entry) =>
        !(entry.round === targetRound && entry.playerId === playerId)
      )

      if (isWinner || score !== '') {
        const adjustedScore = isWinner ? 0 : -Math.abs(score)

        if (!Number.isNaN(adjustedScore)) {
          updatedScores = [...updatedScores, {
            round: targetRound,
            playerId,
            score: adjustedScore,
            isWinner
          }]
        }
      }

      const roundScores = updatedScores.filter((entry) => entry.round === targetRound)
      const winner = roundScores.find((entry) => entry.isWinner)
      const nonWinnerScores = roundScores.filter((entry) =>
        !entry.isWinner && Number.isFinite(entry.score)
      )

      if (winner) {
        const winnerTotal = Math.abs(nonWinnerScores.reduce((sum, entry) => sum + entry.score, 0))
        updatedScores = updatedScores.map((entry) =>
          entry.round === targetRound && entry.isWinner
            ? { ...entry, score: winnerTotal }
            : entry
        )
      }

      return {
        scores: updatedScores,
        updatedAt: new Date(),
      }
    })
  },

  getRoundScores: (round = null) => {
    const { scores, currentRound } = get()
    const targetRound = round ?? currentRound

    return scores.filter((entry) => entry.round === targetRound)
  },

  getUnplayedRounds: () => {
    const { currentRound, finalRound, scores, skippedRounds } = get()
    const skipped = new Set(skippedRounds)
    const rounds = []

    for (let round = currentRound; round <= finalRound; round += 1) {
      if (skipped.has(round)) continue
      if (scores.some((score) => score.round === round)) continue
      rounds.push(round)
    }

    return rounds
  },

  selectNextRound: (nextRound) => {
    set((state) => {
      const selectedRound = Number.parseInt(nextRound, 10)

      if (Number.isNaN(selectedRound)) {
        console.warn('Cannot change round: invalid selection')
        return state
      }

      if (selectedRound < state.currentRound || selectedRound > state.finalRound) {
        console.warn('Cannot change round: selected round is out of range')
        return state
      }

      if (state.scores.some((score) => score.round === selectedRound)) {
        console.warn('Cannot change round: selected round has already been played')
        return state
      }

      if (selectedRound === state.currentRound) {
        return state
      }

      const skippedRounds = new Set(state.skippedRounds)
      for (let round = state.currentRound; round < selectedRound; round += 1) {
        const roundHasScores = state.scores.some((score) => score.round === round)
        if (!roundHasScores) {
          skippedRounds.add(round)
        }
      }

      return {
        currentRound: selectedRound,
        skippedRounds: [...skippedRounds].sort((a, b) => a - b),
        updatedAt: new Date(),
      }
    })

    return get().currentRound
  },

  getRoundPlayerScores: (round = null) => {
    const { getActivePlayers, getRoundScores } = get()
    const roundScores = getRoundScores(round)
    const players = getActivePlayers()

    // Return scores for all players, even those without a score this round
    return players.map((player) => {
      const scoreEntry = roundScores.find(s => s.playerId === player.id)
      return {
        player: player.name,
        playerId: player.id,
        ...scoreEntry ? {
          score: scoreEntry.score,
          isWinner: scoreEntry.isWinner
        } : {
          score: null,
          isWinner: false
        },
      }
    })
  },

  getRoundWinner: (round = null) => {
    const { scores, currentRound, players } = get()
    const targetRound = round ?? currentRound

    const winnerScore = scores.find((entry) => entry.round === targetRound && entry.isWinner === true)
    if (!winnerScore) {
      return
    }

    const player = players.find(({ id }) => id === winnerScore.playerId)
    if (!player) {
      return
    }

    return {
      name: player.name,
      playerId: winnerScore.playerId,
    }
  },

  // Round has a winner and each active player has a score
  getRoundScoresComplete: (round = null) => {
    const { getRoundScores, getActivePlayers } = get()
    const activePlayers = getActivePlayers()
    if (!activePlayers.length) {
      return false
    }

    const roundScores = getRoundScores(round)
    if (!roundScores.some((entry) => entry.isWinner)) {
      return false
    }

    return activePlayers.every((player) => {
      const entry = roundScores.find((score) => score.playerId === player.id)
      if (!entry) {
        return false
      }
      if (entry.isWinner) {
        return true
      }
      return Number.isFinite(entry.score)
    })
  },

  getDealer: (round = null) => {
    const { players, currentRound } = get()
    return getDealerForRound(players, round ?? currentRound)
  },

  getNextPlayableRound: (fromRound = null) => {
    const { currentRound, finalRound, skippedRounds } = get()
    return getNextRoundNumber(
      (fromRound ?? currentRound) + 1,
      finalRound,
      skippedRounds
    )
  },

  advanceRound: () => {
    set((state) => {
      const { getRoundScoresComplete } = get()

      if (getRoundScoresComplete()) {
        const nextRound = getNextRoundNumber(
          state.currentRound + 1,
          state.finalRound,
          state.skippedRounds
        )
        if (!nextRound) {
          console.warn('Cannot advance round: no remaining rounds')
          return state
        }

        return {
          currentRound: nextRound,
          updatedAt: new Date(),
        }
      }

      console.warn('Cannot advance round: missing scores or winner')
      return state
    })
    return get().currentRound
  },

  getStandings: (upToRound = null) => {
    const { players, scores, currentRound } = get()
    const maxRound = upToRound ?? currentRound

    const totals = players.map((player) => {
      const playerScores = scores.filter((entry) =>
        entry.playerId === player.id &&
        entry.round <= maxRound &&
        Number.isFinite(entry.score)
      )

      return {
        player: player.name,
        playerId: player.id,
        score: playerScores.reduce((sum, { score }) => sum + score, 0),
        wins: playerScores.filter((entry) => entry.isWinner).length,
      }
    })

    const maxScore = totals.reduce(
      (max, { score }) => Math.max(max, score),
      Number.NEGATIVE_INFINITY
    )

    return totals
      .map((row) => ({ ...row, isWinner: row.score === maxScore }))
      .sort((a, b) => b.score - a.score)
  },

  getAllRoundScores: () => {
    const { scores } = get()
    const rounds = [...new Set(scores.map(s => s.round))].sort((a, b) => a - b)
    return rounds.map(round => ({
      round,
      scores: get().getRoundScores(round)
    }))
  },

  getGameComplete: () => {
    const { currentRound, finalRound, getRoundScoresComplete } = get()
    return currentRound === finalRound && getRoundScoresComplete()
  },

  playAgain: () => {
    set((state) => initializeGame({
      players: state.players,
    }))
  },

  reset: () => set(initializeGame())
})), {
  name: 'gameState', // The name for your storage key in localStorage
  partialize: (state) => ({
    // Only persist these state items
    players: state.players,
    currentRound: state.currentRound,
    skippedRounds: state.skippedRounds,
    scores: state.scores,
    updatedAt: state.updatedAt,
  })
})

export default useGameStore
