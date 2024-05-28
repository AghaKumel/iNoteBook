import React,{ useContext , useState } from 'react'
import NoteContext from '../context/notes/noteContext';


const AddNote = (props) => {
    const context=useContext(NoteContext);
    const {addNote}=context;
    const [note,setNote]=useState({title:"",description:"",tag:""})

    const handleOnClick=(e)=>{
        e.preventDefault();
        addNote(note.title,note.description,note.tag);
        setNote({title:"",description:"",tag:""})
        props.showAlert("Note Added Successfully","success");
    }

    const onChange=(e)=>{
        setNote({...note,[e.target.name] : e.target.value})
    }

    return (
        <div>
            <h2>AddNote</h2>
            <div className='container my-3'>
                <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" placeholder='Enter minimum 5 characters' name="title" aria-describedby="emailHelp" value={note.title} onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" placeholder='Enter minimum 5 characters' value={note.description} onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name="tag" placeholder='Enter minimum 5 characters' value={note.tag} onChange={onChange}/>
                </div>
                <button type="submit" className="btn btn-primary" onClick={handleOnClick}>Add Note</button>
                </form>
            </div>
        </div>
    )
}

export default AddNote
