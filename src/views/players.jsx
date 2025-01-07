import React from 'react'
import { useNavigate } from 'react-router-dom'
import useGame from '../useGame'
import { useState } from 'react'
import { Block } from '../components/block'
import * as Ariakit from "@ariakit/react"
import { Layout } from '../components/layout'
import { Grid } from '../components/grid'
import { PaperRow, PaperPage, PaperNavButton } from '../components/paper'
import './players.css'

const DeletePlayer = ({ name, index }) => {
  const [show, setShow] = useState(false)
  const { scores, deletePlayer } = useGame()
  const handleDelete = (index) => {
    deletePlayer(index)
    setShow(false)
  }

  return (
    <>
      <Ariakit.Button className="paper-button" style={{ fontSize: '1.6em' }} onClick={() => {
        if (scores.length) {
          setShow(true)
        } else {
          handleDelete(index)
        }
      }}>X</Ariakit.Button>
      <Ariakit.Dialog
        open={show}
        onClose={() => setShow(false)}
        className="dialog"
      >
        <Ariakit.DialogHeading className="dialog-heading">
          Delete Player {name}
        </Ariakit.DialogHeading>
        <p>Are you sure?</p>
        <Grid shelf reverse gap={10}>
          <Ariakit.DialogDismiss className="button">Cancel</Ariakit.DialogDismiss>
          <Ariakit.Button onClick={() => handleDelete(index)} className="button">Delete</Ariakit.Button>
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
        <Grid templateColumns="1fr 50px" valign="center">
          <input
            id="add-player-input"
            name="name"
            type="text"
            required
            aria-description="Type a player name to add"
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
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
  const { players, updatePlayer } = useGame()
  const navigate = useNavigate()
  const [edit, showEdit] = React.useState()
  const handleEdit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target)
    const { name, index } = Object.fromEntries(formData.entries())
    updatePlayer(Number.parseInt(index, 10), name)
    showEdit(null)
  }

  const startGame = () => {
    navigate('/round')
  }

  return (
    <PaperPage>
      <Grid stack split gap="15vh">
        <div>
          <PaperRow space={[15, 27, 0]} style={{ fontSize: '3.5em' }}>Players</PaperRow>
          {players.map(({ name }, index) => (
            <PaperRow
              key={name}
              rule={<DeletePlayer name={name} index={index} />}
            >
              <form onSubmit={handleEdit}>
                <input type="hidden" name="index" value={index} />
                <Grid templateColumns="1fr 50px" valign="center">
                  <input
                    name="name"
                    defaultValue={name}
                    type="text"
                    required
                    autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                    placeholder="Player Name"
                    className="paper-input"
                    onFocus={() => showEdit(index)}
                    onBlur={() => setTimeout(() => showEdit((i) => i === index ? null : i), 100)}
                  />
                  {edit === index ? <Ariakit.Button className="paper-button" type="submit">OK</Ariakit.Button> : null}
                </Grid>
              </form>
            </PaperRow>
          ))}
          <AddPlayer />
        </div>
        {players.length >= 3 ? (
          <PaperNavButton onClick={startGame}>Start Game</PaperNavButton>
        ) : null}
      </Grid>
    </PaperPage >
  )
}

export {
  SelectPlayers,
}
