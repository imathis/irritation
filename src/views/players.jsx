import React from 'react'
import { useNavigate } from 'react-router-dom'
import useGame from '../useGame'
import { useState } from 'react'
import * as Ariakit from "@ariakit/react"
import { Layout } from '../components/layout'
import { Grid } from '../components/grid'
import { PaperRow, PaperPage, PaperHeading, PaperFooter } from '../components/paper'
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
      <Ariakit.Button className="paper-button" onClick={() => {
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
      show ? <Ariakit.Button className="paper-button" onClick={() => setShow(false)}>X</Ariakit.Button> : null
    }>
      <form onSubmit={handleSubmit}>
        <Grid templateColumns="1fr min-content" valign="center">
          <input
            id="add-player-input"
            name="name"
            type="text"
            required
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
            placeholder={show ? 'Player Name' : 'Add Player'}
            className="paper-input"
            onFocus={() => setShow(true)}
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
    <Layout>
      <PaperPage>
        <Grid stack split style={{ minHeight: '100dvh' }}>
          <div>
            <PaperHeading space={[15, 27, 0]}>Players</PaperHeading>
            {players.map(({ name }, index) => (
              <PaperRow
                key={name}
                rule={<DeletePlayer name={name} index={index} />}
              >
                <form onSubmit={handleEdit}>
                  <input type="hidden" name="index" value={index} />
                  <Grid templateColumns="1fr min-content" valign="center">
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
            <PaperFooter space={24}>
              <Ariakit.Button style={{ fontSize: '2em' }} onClick={startGame}>Start Game</Ariakit.Button>
            </PaperFooter>
          ) : null}
        </Grid>
      </PaperPage>
    </Layout>
  )
}

export {
  SelectPlayers,
}
