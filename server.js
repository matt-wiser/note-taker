const express = require('express');
const fs = require('fs');
const uuid = require('./lib/uuid');
const notes = require('./db/db.json');
const path = require('path');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) =>{
    res.sendFile(
        path.join(__dirname, './public/index.html')
    )
});

app.get('/notes', (req, res) =>{
    res.sendFile(
        path.join(__dirname, './public/notes.html')
    )
});

app.get('/api/notes', (req, res) =>{
    
    let notes = fs.readFileSync('./db/db.json');
    notes = JSON.parse(notes);

    res.json(notes);
})

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;
    const newNote = {
        title,
        text,
        id: uuid()
    }
    notes.push(newNote);

    const noteString = JSON.stringify(notes);

    fs.writeFile('./db/db.json', noteString, err =>{
        if (err) {
            console.log(err);
        } else {
            console.log("new note successfully written");
        }
    });
    const response = {
        status: "success",
        body: newNote
    }
    res.json(response);
});

app.delete('/api/notes/:id', (req, res) =>{
    const noteIndex = notes.findIndex(note => note.id === req.params.id);

    if (noteIndex > -1) {
        notes.splice(noteIndex, 1);
    }
    const noteString = JSON.stringify(notes);
    fs.writeFile('./db/db.json', noteString, (err) =>{
        err ? console.log(err) : res.send(notes);
    });
})

app.listen(PORT, ()=>{
    console.log(`APP LISTENING ON ${PORT}`);
})