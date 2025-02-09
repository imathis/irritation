import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initializeGame = (opts = {}) => ({
  players: [],
  currentRound: 1,
  finalRound: 8,
  scores: [],
  updatedAt: new Date(),
  complete: false,
  dealerId: null,
  ...opts,
})

const useGameStore = create(persist((set, get) => ({
  ...initializeGame(),

  addPlayer: (name) => {
    const id = `id${Math.random().toString(16).slice(2)}`
    set((state) => ({
      players: [...state.players, { id, name, active: true }],
      updatedAt: new Date(),
      // dealerId: state.players.length ? state.dealerId : id,
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
      // If scores have been entered, removing the player simply makes them inactive.
      if (state.scores.length) {
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
    if (get().complete) return

    set((state) => {
      const targetRound = round || state.currentRound

      if (!state.players.find(({ id }) => id === playerId)) {
        console.error('Player not found')
        return state
      }

      // If this is a new winner, remove the previous winner's score for this round
      let updatedScores = isWinner ? state.scores.filter(s =>
        !(s.round === targetRound && s.isWinner)
      ) : state.scores

      // Remove any existing score for this player in this round
      updatedScores = updatedScores.filter(s =>
        !(s.round === targetRound && s.playerId === playerId)
      )

      if (isWinner || score !== '') {

        // Convert score to negative for non-winners
        const adjustedScore = isWinner ? 0 : -Math.abs(score)

        // If score is valid update player's score
        if (!Number.isNaN(adjustedScore)) {
          // Add the new score
          updatedScores = [...updatedScores, {
            round: targetRound,
            playerId,
            score: adjustedScore,
            isWinner
          }]
        }
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
    const targetRound = round || currentRound

    const winnerScore = scores.find(s => s.round === targetRound && s.isWinner === true)
    if (winnerScore) {
      return {
        name: players.find(({ id }) => id === winnerScore.playerId).name,
        playerId: winnerScore.playerId,
      }
    }
  },

  // Round has a winner and each player has a score
  getRoundScoresComplete: (round = null) => {
    const { getRoundScores, getRoundWinner, getActivePlayers } = get()
    return getRoundWinner(round) && getRoundScores(round).length === getActivePlayers().length
  },

  getDealer: () => {
    const { dealerId, players, getPlayer, getNextDealer } = get()
    if (!dealerId) {
      const dealer = players.find(({ active }) => active)
      set((state) => ({
        ...state,
        dealerId: dealer.id,
      }))

      return dealer
    } else if (!getPlayer(dealerId).active) {
      const dealer = getNextDealer()
      set((state) => ({
        ...state,
        dealerId: dealer.id,
      }))
      return dealer
    }
    return getPlayer(dealerId)
  },

  getNextDealer: () => {
    const { players, dealerId } = get()

    // Find the index of the current dealer
    const dealerIndex = players.findIndex(player => player.id === dealerId)
    let nextIndex = (dealerIndex + 1) % players.length;

    // Loop until we find an active player or return to the start
    while (!players[nextIndex].active) {
      nextIndex = (nextIndex + 1) % players.length;
      // If we circle back to the current dealer, no active player found
      if (nextIndex === dealerIndex) {
        return null; // or handle as no active player available
      }
    }

    // Return the new dealer's id
    return players[nextIndex]
  },

  advanceRound: () => {
    const { getNextDealer } = get()
    set((state) => {
      const { getRoundScoresComplete } = get()

      // Only advance if we have a winner all players have scores
      if (getRoundScoresComplete()) {
        const { id: dealerId } = getNextDealer()
        return {
          currentRound: state.currentRound + 1,
          dealerId,
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

    const playerScores = players.map((player) => {
      const playerScores = scores.filter(s =>
        s.playerId === player.id &&
        s.round <= maxRound
      )

      const totalScore = playerScores.reduce((sum, { score }) => sum + score, 0)
      const wins = playerScores.filter(s => s.isWinner).length

      const maxScore = Math.max(...players.map((player) => {
        const scoresForPlayer = scores.filter(s => s.playerId === player.id && s.round <= maxRound);
        return scoresForPlayer.reduce((sum, { score }) => sum + score, 0);
      }));

      return {
        player: player.name,
        playerId: player.id,
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
    scores: state.scores,
    updatedAt: state.updatedAt,
  })
})

export default useGameStore
