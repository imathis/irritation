import useGame from '../useGame'
import { Button } from "@ariakit/react"
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout'
import { Title } from '../components/heading'
import { Grid } from '../components/grid';
import { CardFan } from '../components/cardFan'

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
  const { players, reset } = useGame()
  const resumePath = useResumePath()
  const navigate = useNavigate()

  const startGame = () => {
    navigate('/players', { replace: true })
  }
  const resumeGame = () => {
    navigate(resumePath, { replace: true })
  }
  const newGame = async () => {
    await reset()
    navigate('/players', { replace: true })
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
      <Grid align="center" rowGap={8} space={0}>
        {players.length
          ? <Button onClick={resumeGame}>Resume Game</Button>
          : <Button onClick={startGame}>Begin Game</Button>
        }
        {players.length ? <Button onClick={newGame}>New Game</Button> : null}
      </Grid>
    </Layout>
  )
}

export { GameStart }
