import * as Ariakit from '@ariakit/react'
import { useNavigate } from 'react-router-dom'
import { ActionButton } from '../components/button'
import { Grid } from '../components/grid'
import { InlineInput } from '../components/input'
import { PaperPage, PaperRow } from '../components/paper'
import useGame from '../useGame'
import { useRoundNumber } from './useRoundNumber'

const ChooseWinner = ({ playerIndex }) => {
  const { getRoundWinner, addScore } = useGame()
  const roundNumber = useRoundNumber()
  const winner = getRoundWinner(roundNumber)
  return (
    <Ariakit.Button
      onClick={() => addScore({ playerIndex, isWinner: true })}
      tabIndex={-1}
      style={{
        fontSize: '3em',
        transform: 'translateY(.05em)',
        opacity: winner?.playerIndex === playerIndex ? 1 : 0.3
      }}
      className="paper-button">*</Ariakit.Button>
  )
}

const PlayerScore = ({ player, score, playerIndex, isWinner }) => {
  const { addScore } = useGame()
  const roundNumber = useRoundNumber()
  const handleSubmit = (event) => {
    const form = event.target.closest('form')
    if (event.target === form) {
      event.preventDefault()
    }
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    const { playerIndex, score } = data

    addScore({ round: roundNumber, playerIndex: Number.parseInt(playerIndex, 10), score })
  }


  return (
    <PaperRow
      rule={<ChooseWinner playerIndex={playerIndex} />}
      className={isWinner ? 'round-winner' : null}
    >
      {isWinner ? (
        <Grid space={[13, 26]} shelf split valign="center">
          <div>{player}</div>
          <div style={{ textAlign: 'right' }}>{score}</div>
        </Grid>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="playerIndex" value={playerIndex} />
          <Grid space={[10, 26]} templateColumns="1fr auto" valign="center">
            <label htmlFor={`scoreFor${playerIndex}`}>{player}</label>
            <InlineInput
              name="score"
              defaultValue={score ? Math.abs(score) : null}
              id={`scoreFor${playerIndex}`}
              type="number"
              inputMode="numeric"
              autoComplete="off" autoCorrect="off" spellCheck="false"
              negative={!isWinner || null}
              placeholder="___"
              className="paper-input"
              onBlur={handleSubmit}
              pattern="[0-9]*"
              required
            />
          </Grid>
        </form>
      )}
    </PaperRow>
  )
}

const NextRound = () => {
  const roundNumber = useRoundNumber()
  const { getRoundScoresComplete, currentRound, advanceRound } = useGame()
  const navigate = useNavigate()
  if (!getRoundScoresComplete(roundNumber)) {
    return
  }
  const nextRound = () => {
    if (roundNumber === currentRound) advanceRound()
    navigate('../round/2')
  }
  if (roundNumber === 1) {
    return <ActionButton onClick={nextRound}>Next Round</ActionButton>
  }
  return <ActionButton onClick={() => navigate('../standings')}>Standings</ActionButton>
}

export const Scores = () => {
  const { getRoundPlayerScores, getRoundScoresComplete } = useGame()
  const roundNumber = useRoundNumber()
  const scores = getRoundPlayerScores(roundNumber)

  return (
    <PaperPage>
      <Grid stack split style={{ minHeight: 'var(--full-safe-height)' }} space={[0, 0, '5vh']}>
        <div>
          <PaperRow space={[15, 27, 0]} style={{ fontSize: '3.5em' }}>Scores</PaperRow>
          {scores.map((score) => (
            <PlayerScore key={score.playerIndex} {...score} />
          ))}
          {!getRoundScoresComplete(roundNumber) ? (
            <PaperRow space={[15, 27]} style={{ fontSize: '1.2em' }} line={false}>
              Tap * to choose a winner. Tap&nbsp;names to enter scores.
            </PaperRow>
          ) : null}
        </div>
        <NextRound />
      </Grid>
    </PaperPage>
  )
}
