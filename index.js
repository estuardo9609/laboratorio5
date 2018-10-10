const express = require('express');
const app = express();
var controller = require("./model/playlists.js");
myPlaylists= controller.playlists;

app.use(express.json());

app.get('/api/playlists', (req, res) => {
    res.json(myPlaylists);
});

app.get('/api/playlists/:id', (req, res) => {
    let playlist = myPlaylists.find(c => c.id == parseInt(req.params.id));
    if(!playlist) res.status(404).send('El playlist que busca no se encuentra'); //404
    res.status(200).json(playlist);
});

app.post('/api/playlists', (req, res) => {
    const playlist = {
        id: myPlaylists.length + 1,
        name: req.body.name,
        description: req.body.description,
        genre: req.body.genre,
        rate: req.body.rate,
        hide: true
    };
    myPlaylists.push(playlist);
    res.status(201).send(playlist);
});

app.put('/api/playlists/:id', (req, res) => {
    const playlist = myPlaylists.find(c => c.id == parseInt(req.params.id));
    if(!playlist) res.status(404).send('El playlist que busca no se encuentra'); //404
    
    playlist.name = req.body.name;
    playlist.description = req.body.description;
    playlist.genre = req.body.genre;
    playlist.rate = req.body.rate;
    playlist.hide = true;

    res.status(204).send(playlist);
});

//PORT
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));