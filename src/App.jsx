import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameStart } from './views/gameStart'
import { SelectPlayers } from './views/players'
import { Round } from './views/round'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameStart />} />
        <Route path="/players/*" element={<SelectPlayers />} />
        <Route path="/round" element={<Round />} />
        {/* <Route path="/scores" element={<AddScores />} /> */}
        {/* <Route path="/standings" element={<ShowStandings />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
