import { Grid } from "../components/grid";
import { Button } from "@ariakit/react"
import { ActionButton, MainButton } from "../components/button";

import { useState } from 'react'
import useGame from '../useGame'
import { useNavigate } from 'react-router-dom';
import './menu.css'

export const Menu = ({ fixed }) => {
  const { reset, playAgain } = useGame()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const editPlayers = () => {
    navigate('/players', { replace: true })
  }

  const newGame = async () => {
    await reset()
    navigate('/', { replace: true })
  }

  return (
    <div className="menu" data-fixed={fixed || null}>
      <Button data-active={showMenu || null} ariaLabel="show menu" className="menu-button" onClick={() => setShowMenu((s) => !s)}>
        <div className="menu-button-text" />
      </Button>
      {showMenu ? (
        <div className="menu-panel">
          <Grid gap={20} className="menu-panel-options">
            <Button onClick={editPlayers}>Edit Players</Button>
            <Button onClick={newGame}>New Game</Button>
          </Grid>
        </div>
      ) : null}
    </div>
  )
}
