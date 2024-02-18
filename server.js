const express = require('express');
const path = require('path');
const fs = require('fs');
const db_notes = require('./db/db.json');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const newNote = req.body;
      newNote.id = Math.floor(Math.random() * 1000);
      db_notes.push(newNote);
      fs.writeFile('./db/db.json', JSON.stringify(db_notes), (err) => {
        if (err) {
          console.error(err);
        } else {
          res.json(db_notes);
        }
      });
  });

app.delete('/api/notes/:id', (req, res) => {
  const Id = req.params.id;
  const noteIndex = db_notes.findIndex((note) => note.id == Id);
  db_notes.splice(noteIndex, 1);
  fs.writeFile('./db/db.json', JSON.stringify(db_notes), (err) => {
    if (err) {
      console.error(err);
    } else {
      res.json(db_notes);
    }
  });
});



app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);