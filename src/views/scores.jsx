import * as Ariakit from '@ariakit/react'
import { Grid } from '../components/grid'
import { Layout } from '../components/layout'
import { PaperPage, PaperRow } from '../components/paper'
import { useNavigate } from 'react-router-dom'
import { useRoundNumber } from './useRoundNumber'
import useGame from '../useGame'

const ChooseWinner = ({ playerIndex }) => {
  const { getRoundWinner, addScore } = useGame()
  const roundNumber = useRoundNumber()
  const winner = getRoundWinner(roundNumber)
  return (
    <Ariakit.Button
      onClick={() => addScore({ playerIndex, isWinner: true })}
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

    addScore({ round: roundNumber, playerIndex: Number.parseInt(playerIndex, 10), score: Number.parseInt(score, 10) })
  }


  return (
    <PaperRow
      rule={<ChooseWinner playerIndex={playerIndex} />}
      className={isWinner ? 'round-winner' : null}
    >
      {isWinner ? (
        <Grid space={[13, 26]} shelf split valign="center">
          <div>{player}</div>
          <div style={{ textAlign: "right" }}>Winner!</div>
        </Grid>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="playerIndex" value={playerIndex} />
          <Grid space={[10, 0, 10, 26]} shelf split valign="center">
            <label htmlFor={`scoreFor${playerIndex}`}>{player}</label>
            <input
              name="score"
              defaultValue={Math.abs(score) || null}
              id={`scoreFor${playerIndex}`}
              type="number"
              inputMode="numeric"
              autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
              placeholder="Add"
              onChange={(e) => {
                const val = e.target.value;
                if (!/^[0-9]*$/.test(val)) {
                  e.target.value = val.replace(/[^0-9]/g, '');
                }
              }}
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

export const Scores = () => {
  const { getRoundPlayerScores, getRoundScoresComplete } = useGame()
  const roundNumber = useRoundNumber()
  const scores = getRoundPlayerScores(roundNumber)
  const navigate = useNavigate()

  return (
    <Layout>
      <PaperPage>
        <Grid stack split style={{ minHeight: '100dvh' }}>
          <div>
            <PaperRow space={[15, 27, 0]} style={{ fontSize: '3.5em' }}>Scores</PaperRow>
            {scores.map((score) => (
              <PlayerScore key={score.playerIndex} {...score} />
            ))}
          </div>
          {getRoundScoresComplete(roundNumber) ? (
            <PaperRow line={false} space={24}>
              <Ariakit.Button onClick={() => navigate('../standings')}>Standings &rarr;</Ariakit.Button>
            </PaperRow>
          ) : null}
        </Grid>
      </PaperPage>
    </Layout>)
}
