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
  return <Navigate to={`/round/${currentRound}`} />
}

const NewGame = () => {
  const { reset } = useGame()
  const navigate = useNavigate()
  React.useEffect(() => {
    reset()
    navigate('/players')
  }, [navigate, reset])
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameStart />} />
        <Route path="/new" element={<NewGame />} />
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
