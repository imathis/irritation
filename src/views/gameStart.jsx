import { useNavigate } from 'react-router-dom'
import { MainButton } from '../components/button'
import { CardFan } from '../components/cardFan'
import { Grid } from '../components/grid'
import { Title } from '../components/heading'
import { Layout } from '../components/layout'
import useGame from '../useGame'

const useResumePath = () => {
  const { scores, currentRound } = useGame()
  if (scores.find((s) => s?.round === currentRound)) {
    return '/standings'
  } else if (scores.length) {
    return '/round'
  }
  return '/players'
}

const GameStart = () => {
  const { players } = useGame()
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
    <Layout>
      <Title />
      <div className="card-fan-footer">
        <div className="card-fan-wrapper">
          <CardFan cards={['10S', 'JH', 'QC', 'KD']} />
        </div>
        <div className="card-fan-wrapper">
          <CardFan cards={['7S', '7H', '7C']} />
        </div>
      </div>
      <Grid stack align="center" rowGap={8}>
        {players.length
          ? <MainButton onClick={resumeGame}>Resume Game</MainButton>
          : <MainButton onClick={startGame}>Begin Game</MainButton>
        }
        {players.length ? <MainButton onClick={newGame}>New Game</MainButton> : null}
      </Grid>
    </Layout>
  )
}

export { GameStart }
