const express = require('express');
const app = express();
var controller = require("./model/playlists.js");
myPlaylists= controller.playlists;

app.get('/api/playlists', (req, res) => {
    res.send(myPlaylists);
});

app.get('/api/playlist/:id', (req, res) => {
    let playlist = myPlaylists.find(c => c.id == parseInt(req.params.id));
    if(!playlist) res.status(404).send('El playlist que busca no se encuentra'); //404
    res.status(200).json(playlist);
});



//PORT
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));