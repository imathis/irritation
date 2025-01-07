import useGame from '../useGame'
import { useNavigate } from 'react-router-dom'
import { Grid } from '../components/grid';
import { Layout } from '../components/layout'
import { useRoundNumber } from './useRoundNumber'
import { ActionButton } from '../components/button';
import { RoundTitle } from '../components/title';

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

const Round = () => {
  const { players } = useGame()
  const round = useRoundNumber()
  const { deal, books, runs } = dealForRound(round)
  const navigate = useNavigate()
  const dealer = players[round % (players.length - 1)].name

  return (
    <Layout className="splash-screen">
      <Grid stack split style={{ minHeight: 'var(--full-safe-height)' }} space={[20, 10, 40]}>
        <RoundTitle {...{ books, runs, deal, round, dealer, }} />
        <ActionButton onClick={() => navigate('scores')}>Record Scores</ActionButton>
      </Grid>
    </Layout>
  )
}

export { Round }
