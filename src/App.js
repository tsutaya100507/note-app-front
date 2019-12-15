import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Note from './components/Note'
import './App.css';

const App =() => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  const hook =() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }
  
  useEffect(hook, [])

  const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

  const toggleImportanceOf = id => {
    console.log(
      'importance of' + id + 'needs to be toggled'
    )
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changeNote = { ...note, important: !note.important }

    axios.put(url, changeNote).then(response => {
      setNotes(notes.map(note => note.id !== id ? note : response.data))
    })
  }

  const rows = () => notesToShow.map(note =>
    <Note
      key={note.id}
      note={note}
      toggleImportanceOf={() => toggleImportanceOf(note.id)}
    />
  )

  const addNotes = event => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const noteObject = {
      content: newNote,
      data: new Date().toISOString(),
      important: Math.random() > 0.5,
      // id: notes.length + 1,
    }

    axios
      .post('http://localhost:3001/notes', noteObject)
      .then(response => {
        console.log(response)
        setNotes(notes.concat(noteObject))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }
 
  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {rows()}
      </ul>
      <form onSubmit={addNotes}>
        <input 
          value={newNote} 
          onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App
