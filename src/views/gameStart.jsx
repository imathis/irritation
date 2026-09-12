import { useNavigate } from 'react-router-dom'
import { MainButton } from '../components/button'
import { CardFan } from '../components/cardFan'
import { Grid } from '../components/grid'
import { MainTitle } from '../components/title'
import { Layout } from '../components/layout'
import useGame from '../useGame'

const useResumePath = () => {
  const { scores, currentRound, getRoundScoresComplete } = useGame()

  if (getRoundScoresComplete(currentRound)) {
    return `/round/${currentRound}/standings`
  }

  if (scores.some((score) => score?.round === currentRound)) {
    return `/round/${currentRound}/scores`
  }

  if (scores.length) {
    return `/round/${currentRound}`
  }

  return '/players'
}

const GameStart = () => {
  const { players, getGameComplete } = useGame()
  const resumePath = useResumePath()
  const navigate = useNavigate()

  const startGame = () => {
    navigate('/players', { replace: true })
  }
  const resumeGame = () => {
    navigate(resumePath, { replace: true })
  }
  const newGame = async () => {
    navigate('/new')
  }
  return (
    <Layout className="splash-screen">
      <MainTitle />
      <div className="app-footer">
        <div className="card-fan-footer">
          <div className="card-fan-wrapper">
            <CardFan cards={['10S', 'JH', 'QC', 'KD']} />
          </div>
          <div className="card-fan-wrapper">
            <CardFan cards={['7S', '7H', '7C']} />
          </div>
        </div>
      </div>
      <Grid stack align="center" style={{ transform: 'rotate(-8deg)' }}>
        {players.length && !getGameComplete()
          ? <MainButton onClick={resumeGame}>Resume Game</MainButton>
          : <MainButton onClick={startGame}>Begin Game</MainButton>
        }
        {players.length && !getGameComplete() ? <MainButton onClick={newGame}>New Game</MainButton> : null}
      </Grid>
    </Layout>
  )
}

export { GameStart }
