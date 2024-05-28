import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";

  const notesInitial = []

  const [notes, setNotes] = useState(notesInitial);


  //get all note
  const getNotes =async () => {
    // TODO :API call
    const url = `${host}/api/notes/fetchallnotes`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token'),
      }
    });
    const json=await response.json();
    setNotes(json);
  };

  //add a note
  const addNote =async (title, description, tag) => {
    // TODO :API call
    const url = `${host}/api/notes/addnote`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token'),
      },
      body: JSON.stringify({title,description,tag}),
    });
    const json = await response.json();

    const note = {
      _id: json._id,
      user: json.user,
      title: title,
      description: description,
      tag: tag,
      date:json.date,
      __v: json.__v,
    };
    setNotes(notes.concat(note));
  };

  //delete a note
  const deleteNote = async (id) => {
    // TODO :API call
    const url = `${host}/api/notes/deletenote/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token'),
      }
    });
    const json =await response.json();
    console.log(json)

    const newNotes = notes.filter((note) => (note._id !== id));
    setNotes(newNotes);
  };

  //edit a note
  const editNote = async (id, title, description, tag) => {
    //API CALL
    const url = `${host}/api/notes/updatenote/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token'),
      },
      body: JSON.stringify({title,description,tag}),
    });
    const json =await response.json();
    console.log(json);
    //logic to edit in client
    // console.log(
    //   "editing a node with particular details " + id + title + description + tag
    // );
    const newNotes = notes.map((note) =>
      note._id === id ? { ...note, title, description, tag } : note
    );
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote ,getNotes}}>
      {props.children}
    </NoteContext.Provider>
  );
};
export default NoteState;
