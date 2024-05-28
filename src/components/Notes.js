import React,{ useContext, useEffect, useRef, useState } from "react";
import NoteContext from '../context/notes/noteContext';
import NoteItem from "./NoteItem";
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom'



const Notes = (props) => {
  const navigate=useNavigate();
    const context=useContext(NoteContext);
    const {notes,getNotes,editNote}=context;
    const [note,setNote]=useState({id:"",title:"",description:"",tag:""})

    useEffect(()=>{
      if(localStorage.getItem('token'))
      {
        getNotes();
      }
      else
      {
        navigate("/login")
      }
      // eslint-disable-next-line
    },[])

    const updateNote=(currNote)=>{
        setNote(currNote);
        ref.current.click();
    }

    const ref=useRef(null);
    const refClose=useRef(null);

    const handleOnClick=()=>{
      // console.log("data is updating",note);
      editNote(note._id,note.title,note.description,note.tag);
      refClose.current.click();
      props.showAlert("Updated Successfully","success");
    }

    const onChange=(e)=>{
        setNote({...note,[e.target.name] : e.target.value})
    }
    


  return (
    <div>
      <AddNote showAlert={props.showAlert}/>
      <button type="button" className="btn btn-primary d-none" ref={ref} data-bs-toggle="modal" data-bs-target="#exampleModal">
      Launch demo modal
      </button>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" placeholder={note.title} aria-describedby="emailHelp" onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" placeholder={note.description} onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name="tag" placeholder={note.tag} onChange={onChange}/>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={handleOnClick}>Update Note</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
        <h2>Your notes</h2>
        <div className="container mx-2">
          {notes.length===0 && "No display to display"}
        </div>
        {notes.map((note) => {
          return <NoteItem key={note._id} updateNote={updateNote} showAlert={props.showAlert} notes={note}/>;
        })}
      </div>
    </div>
  );
};

export default Notes;
