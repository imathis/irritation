import useGame from '../useGame'
import { useNavigate } from 'react-router-dom'
import { Grid } from '../components/grid';
import { Layout } from '../components/layout'
import { useRoundNumber } from './useRoundNumber'
import * as Ariakit from '@ariakit/react'

const countBooksAndRuns = (number) => {
  let books = 0;
  let runs = 0;

  // Calculate how many 'books' or 'runs' fit into the number
  while (number > 0) {
    if (number >= 4) {
      if (number % 4 === 0) {  // If divisible by 4, add a run
        runs++;
        number -= 4;
      } else { // If not divisible by 4, add a book if possible
        books++;
        number -= 3;
      }
    } else {
      if (number === 3) {
        books++;
      }
      number = 0; // Set number to 0 to exit loop
    }
  }
  return { books, runs }
}

const dealForRound = (roundNumber) => {
  let deal = 6

  if (roundNumber === 7) {
    return { deal: 13, books: 4 }
  }
  if (roundNumber === 8) {
    return { deal: 13, books: 4, runs: 3 }
  }

  deal = deal + roundNumber
  return { deal, ...countBooksAndRuns(deal - 1) }
}

const Collect = ({ round, books, runs }) => {
  if (round === 8) {
    return <h1>Collect {books} books or {runs} runs</h1>
  }
  if (books && runs) {
    return <h1>Collect {books} {books === 1 ? 'book' : 'books'} and {runs} {runs === 1 ? 'run' : 'runs'}</h1>
  }
  if (books) {
    return <h1>Collect {books} {books === 1 ? 'book' : 'books'}</h1>
  }

  if (runs) {
    return <h1>Collect {runs} {runs === 1 ? 'run' : 'runs'}</h1>
  }
}

const Round = () => {
  const { players } = useGame()
  const roundNumber = useRoundNumber()
  const { deal, books, runs } = dealForRound(roundNumber)
  const navigate = useNavigate()

  return (
    <Layout>
      <Grid stack space={20} split style={{ minHeight: '100dvh' }}>
        <div>
          <h1>Round {roundNumber}</h1>
          <Collect round={roundNumber} {...{ books, runs }} />
          <h2>{players[roundNumber % (players.length - 1)].name} Deals</h2>
          <p>Deal {deal} to each player</p>
        </div>
        <Ariakit.Button style={{ fontSize: '1.5em' }} onClick={() => navigate('scores')}>Record Scores</Ariakit.Button>
      </Grid>
    </Layout>
  )
}

export { Round }
