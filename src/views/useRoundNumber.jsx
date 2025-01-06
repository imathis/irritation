import { useParams } from 'react-router-dom'
export const useRoundNumber = () => {
  const { roundNumber } = useParams()
  return Number.parseInt(roundNumber, 10)
}
