import { Grid } from '../components/grid'
import { PaperPage, PaperRow } from '../components/paper'
import { ActionButton } from '../components/button'
import { useNavigate } from 'react-router-dom'
import { useRoundNumber } from './useRoundNumber'
import useGame from '../useGame'
import { Menu } from './menu'

const WinnerMark = ({ wins, isWinner }) => {
  const { getGameComplete, currentRound, finalRound } = useGame()
  const final = getGameComplete() && currentRound === finalRound
  if (final) {
    return (
      <div
        style={{
          fontSize: '2em',
          lineHeight: '1em',
          textAlign: 'center',
        }}>{wins}</div>
    )
  }
  return isWinner ? (
    <div
      style={{
        fontSize: '3em',
        transform: 'translateY(.05em)',
        lineHeight: '1em',
        textAlign: 'center',
      }}
      className="paper-button">*</div>
  ) : <div />
}

const PlayerScore = ({ player, score, isWinner, wins }) => {
  return (
    <PaperRow
      rule={<WinnerMark wins={wins} isWinner={isWinner} />}
      className={isWinner ? 'round-winner' : null}
    >
      <Grid space={[10, 26]} shelf split valign="center" style={{ opacity: player.active ? 1 : '0.5' }}>
        <div>{player.name}</div>
        <div style={{ textAlign: "right" }}>{score}</div>
      </Grid>
    </PaperRow>
  )
}

export const Standings = () => {
  const { getStandings, getPlayer, getGameComplete, advanceRound, currentRound } = useGame()
  const roundNumber = useRoundNumber()
  const scores = getStandings(roundNumber)
  const navigate = useNavigate()
  const final = getGameComplete()

  const nextRound = () => {
    if (roundNumber === currentRound) {
      return navigate(`/round/${advanceRound()}`)
    }
    navigate(`/round/${roundNumber + 1}`)
  }
  const playAgain = () => {
    navigate(`/again`)
  }

  return (
    <PaperPage>
      <Grid stack split style={{ minHeight: 'var(--full-safe-height)' }} space={[0, 0, '5vh']}>
        <div>
          <PaperRow
            rule={final ? (
              <div
                style={{
                  fontSize: '1em',
                  lineHeight: '2em',
                  textAlign: 'center',
                  paddingTop: '10px',
                }}>wins</div>) : <Menu />}
            className="heading">
            {final ? 'Final Scores' : 'Standings'}
          </PaperRow>
          {scores.map((score) => (
            <PlayerScore key={score.playerId} {...score} player={getPlayer(score.playerId)} />
          ))}
        </div>
        {final ? (
          <ActionButton onClick={playAgain}>Play Again?</ActionButton>
        ) : (
          <ActionButton onClick={nextRound}>Next Round</ActionButton>
        )}
      </Grid>
    </PaperPage>
  )
}
