import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { GameStart } from './views/gameStart'
import { SelectPlayers } from './views/players'
import { Round } from './views/round'
import { Scores } from './views/scores'
import { Standings } from './views/standings'
import useGame from './useGame'

const RoundRedirect = () => {
  const { currentRound } = useGame()
  return <Navigate to={`/round/${currentRound}`} replace />
}

const NewGame = ({ resetGame, restartGame }) => {
  const { reset, playAgain } = useGame()
  const navigate = useNavigate()
  React.useEffect(() => {
    if (resetGame) reset()
    if (restartGame) playAgain()
    navigate('/players')
  }, [navigate, reset, playAgain])
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameStart />} />
        <Route path="/new" element={<NewGame reset />} />
        <Route path="/again" element={<NewGame restartGame />} />
        <Route path="/players/*" element={<SelectPlayers />} />
        <Route path="/round/:roundNumber">
          <Route index element={<Round />} />
          <Route path="scores" element={<Scores />} />
          <Route path="standings" element={<Standings />} />
        </Route>
        <Route path="*" element={<RoundRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
