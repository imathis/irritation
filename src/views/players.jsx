import React from 'react'
import { useNavigate } from 'react-router-dom'
import useGame from '../useGame'
import { useState } from 'react'
import * as Ariakit from "@ariakit/react"
import { Grid } from '../components/grid'
import { PaperRow, PaperPage } from '../components/paper'
import { ActionButton } from '../components/button'
import './players.css'

const DeletePlayer = ({ name, id }) => {
  const [show, setShow] = useState(false)
  const { scores, deletePlayer } = useGame()
  const handleDelete = (id) => {
    deletePlayer(id)
    setShow(false)
  }

  return (
    <>
      <Ariakit.Button className="paper-button" style={{ fontSize: '1.6em' }} onClick={() => {
        if (scores.length) {
          setShow(true)
        } else {
          handleDelete(id)
        }
      }}>X</Ariakit.Button>
      <Ariakit.Dialog
        open={show}
        onClose={() => setShow(false)}
        className="dialog"
      >
        <Ariakit.DialogHeading className="dialog-heading">
          Are you sure you want to remove this player from the game?
        </Ariakit.DialogHeading>
        <Grid shelf reverse>
          <Ariakit.Button onClick={() => handleDelete(id)} className="destructive-button">Remove</Ariakit.Button>
          <Ariakit.DialogDismiss className="cancel-button">Cancel</Ariakit.DialogDismiss>
        </Grid>
      </Ariakit.Dialog>
    </>
  )
}

const AddPlayer = () => {
  const [show, setShow] = useState(false)
  const { addPlayer } = useGame()
  const inputRef = React.useRef()

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target)
    const { name } = Object.fromEntries(formData.entries())
    addPlayer(name)
    // Get all input elements in the form
    const inputs = event.target.querySelectorAll('input[type=text]');

    // Loop through each input and clear its value
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = '';
    }
    setShow(false)
  }
  return (
    <PaperRow rule={
      show ? <Ariakit.Button className="paper-button" style={{ fontSize: '1.6em' }} onClick={() => setShow(false)}>X</Ariakit.Button> : null
    }>
      <form onSubmit={handleSubmit}>
        <Grid space={[10, 20]} templateColumns="1fr auto" valign="center">
          <input
            id="add-player-input"
            name="name"
            type="text"
            required
            aria-description="Type a player name to add"
            autoComplete="off" autoCorrect="off" spellCheck="false"
            placeholder={show ? 'Player Name' : 'Add Player'}
            className="paper-input"
            onFocus={() => setShow(true)}
            onBlur={() => setTimeout(() => setShow(false), 100)}
            ref={inputRef}
          />
          {show ? <Ariakit.Button className="paper-button" type="submit">OK</Ariakit.Button> : null}
        </Grid>
      </form>
    </PaperRow>
  )
}

const SelectPlayers = () => {
  const { getActivePlayers, updatePlayer, scores } = useGame()
  const navigate = useNavigate()
  const [edit, showEdit] = React.useState()
  const handleEdit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target)
    const { name, id } = Object.fromEntries(formData.entries())
    updatePlayer(id, name)
    showEdit(null)
  }

  const startGame = () => {
    navigate('/round')
  }
  const players = getActivePlayers()

  return (
    <PaperPage>
      <Grid stack split style={{ minHeight: 'var(--full-safe-height)' }} space={[0, 0, '5vh']}>
        <div>
          <PaperRow space={[15, 27, 0]} style={{ fontSize: '3.5em' }}>Players</PaperRow>
          {players.map(({ name, id }) => (
            <PaperRow
              key={name}
              rule={<DeletePlayer name={name} id={id} />}
            >
              <form onSubmit={handleEdit}>
                <input type="hidden" name="id" value={id} />
                <Grid space={[10, 20]} templateColumns="1fr auto" valign="center">
                  <input
                    name="name"
                    defaultValue={name}
                    type="text"
                    required
                    autoComplete="off" autoCorrect="off" spellCheck="false"
                    placeholder="Player Name"
                    className="paper-input"
                    onFocus={() => showEdit(id)}
                    onBlur={() => setTimeout(() => showEdit((i) => i === id ? null : i), 100)}
                  />
                  {edit === id ? <Ariakit.Button className="paper-button" type="submit">OK</Ariakit.Button> : null}
                </Grid>
              </form>
            </PaperRow>
          ))}
          <AddPlayer />
        </div>
        {players.length >= 3 ? (
          <ActionButton onClick={startGame}>{scores.length ? 'Resume' : 'Start'} Game</ActionButton>
        ) : null}
      </Grid>
    </PaperPage >
  )
}

export {
  SelectPlayers,
}
