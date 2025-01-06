import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initializeGame = (opts = {}) => ({
  players: [],
  currentRound: 1,
  finalRound: 8,
  scores: [],
  updatedAt: new Date(),
  ...opts,
})

const useGameStore = create(persist((set, get) => ({
  ...initializeGame(),

  addPlayer: (name) => {
    set((state) => ({
      players: [...state.players, { name }],
      updatedAt: new Date(),
    }))
  },

  updatePlayer: (index, name) => {
    set((state) => ({
      players: state.players.map((player, i) =>
        i === index ? { name } : player
      ),
      updatedAt: new Date(),
    }))
  },

  deletePlayer: (index) => {
    set((state) => ({
      players: state.players.filter((_, i) => i !== index),
      updatedAt: new Date(),
    }))
  },

  addScore: ({ playerIndex, score, isWinner = false, round = null }) => {
    set((state) => {
      const targetRound = round || state.currentRound

      if (!state.players[playerIndex]) {
        console.error('Player not found')
        return state
      }

      // If this is a new winner, remove the previous winner's score for this round
      let updatedScores = isWinner ? state.scores.filter(s =>
        !(s.round === targetRound && s.isWinner)
      ) : state.scores

      // Remove any existing score for this player in this round
      updatedScores = updatedScores.filter(s =>
        !(s.round === targetRound && s.playerIndex === playerIndex)
      )

      // Convert score to negative for non-winners
      const adjustedScore = isWinner ? 0 : -Math.abs(score)

      // If score is valid update player's score
      if (!Number.isNaN(adjustedScore)) {
        // Add the new score
        updatedScores = [...updatedScores, {
          round: targetRound,
          playerIndex,
          score: adjustedScore,
          isWinner
        }]
      }

      // Get all scores for the target round after adding the new score
      const roundScores = updatedScores.filter(s => s.round === targetRound)
      const winner = roundScores.find(s => s.isWinner)
      const nonWinnerScores = roundScores.filter(s => !s.isWinner)

      // If there's a winner, update their score based on current non-winner scores
      if (winner) {
        updatedScores = updatedScores.map(s =>
          s.round === targetRound && s.isWinner
            ? { ...s, score: Math.abs(nonWinnerScores.reduce((sum, s) => sum + s.score, 0)) }
            : s
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
    const targetRound = round || currentRound

    return scores.filter(s => s.round === targetRound)
  },

  getRoundPlayerScores: (round = null) => {
    const { players, getRoundScores } = get()
    const roundScores = getRoundScores(round)

    // Return scores for all players, even those without a score this round
    return players.map((player, index) => {
      const scoreEntry = roundScores.find(s => s.playerIndex === index)
      return {
        player: player.name,
        playerIndex: index,
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
    const targetRound = round || currentRound

    const winnerScore = scores.find(s => s.round === targetRound && s.isWinner === true)
    if (winnerScore) {
      return {
        name: players[winnerScore.playerIndex].name,
        playerIndex: winnerScore.playerIndex,
      }
    }
  },

  // Round has a winner and each player has a score
  getRoundScoresComplete: (round = null) => {
    const { getRoundScores, getRoundWinner, players } = get()
    return getRoundWinner(round) && getRoundScores(round).length === players.length
  },

  advanceRound: () => {
    set((state) => {
      const { getRoundScoresComplete } = get()

      // Only advance if we have a winner all players have scores
      if (getRoundScoresComplete()) {
        return {
          currentRound: state.currentRound + 1,
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
    const maxRound = upToRound || currentRound

    const playerScores = players.map((player, playerIndex) => {
      const playerScores = scores.filter(s =>
        s.playerIndex === playerIndex &&
        s.round <= maxRound
      )

      const totalScore = playerScores.reduce((sum, { score }) => sum + score, 0)
      const wins = playerScores.filter(s => s.isWinner).length

      const maxScore = Math.max(...players.map((_, idx) => {
        const scoresForPlayer = scores.filter(s => s.playerIndex === idx && s.round <= maxRound);
        return scoresForPlayer.reduce((sum, { score }) => sum + score, 0);
      }));

      return {
        player: player.name,
        playerIndex,
        score: totalScore,
        wins,
        isWinner: totalScore === maxScore,
      }
    }).sort((a, b) => b.totalScore - a.totalScore)
    return playerScores
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
    const { currentRound, getRoundScoresComplete } = get()
    return currentRound === 8 && getRoundScoresComplete()
  },

  newGame: () => {
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
    scores: state.scores,
    updatedAt: state.updatedAt,
  })
})

export default useGameStore
