const express = require('express');
const app = express();
var cors = require('cors');
var mongoController = require("./controller/mongoController.js");
var mongoDatabase = require("./Database/database");

//Habilitar json y cors para conectar con el front-end
app.use(express.json());
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//CRUD
app.get('/api/playlists', mongoController.getPlaylists);

app.get('/api/playlists/:id', mongoController.getPlaylist);

app.post('/api/playlists', mongoController.insertPlaylist);

app.put('/api/playlists/:id', mongoController.editPlaylist);

app.delete('/api/playlists/:id', mongoController.deletePlaylist);

app.all('*', function(req, res) {
    return res.status(400).jsonp({message: "El metodo seleccionado no existe"});
})



//PORT
const port = 3001;
const host = '0.0.0.0'
app.listen(port,host, () => console.log(`Listening on port ${port}...`));