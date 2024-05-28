const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

const fetchuser = require("../middleware/fetchuser");

// ROUTE 1:  get loggedin user's notes details  :  GET "/api/auth/fetchalluser" require authentication

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 2:  add notes in loggedin user's notes   :  POST "/api/auth/addnote" require authentication

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Enter a valid description").isLength({ min: 5 }),
    body("tag", "Enter a valid tag").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const result = validationResult(req);
      // if there are any errors then return that bad errors
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 3:  update note in loggedin user's notes   :  PUT "/api/auth/updatenote" require authentication

router.put(
  "/updatenote/:id",
  fetchuser,
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const newNote={};
      if(title){newNote.title=title};
      if(description){newNote.description=description};
      if(tag){newNote.tag=tag};

      //find the note to be updated and update it
      let note=await Notes.findById(req.params.id);
      if(!note)
        {
          return res.status(404).json({error:"please enter the correct id"});
        }
      if(note.user.toString()!==req.user.id)
        {
          return res.status(401).json({error:"Ur not updating ur notes"});
        }

        note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});

        res.json({note});

    } 
    catch (error) 
    {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
)

// ROUTE 4:  delete a note in loggedin user's notes   :  DELETE "/api/auth/deletenote" require authentication

router.delete(
  "/deletenote/:id",fetchuser,async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //find the note to be deleted and delete it
      let note=await Notes.findById(req.params.id);
      if(!note)
        {
          return res.status(404).json({error:"please enter the correct id"});
        }
        //allows user to delete if he is genuine
      if(note.user.toString()!==req.user.id)
        {
          return res.status(401).json({error:"Ur not updating ur notes"});
        }

        note=await Notes.findByIdAndDelete(req.params.id);

        res.json({"Success":"Note has been deleted",note:note});

    } 
    catch (error) 
    {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
)
module.exports = router;
