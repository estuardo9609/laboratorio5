const express = require('express');
const app = express();
var controller1 = require("./controller/controller.js");
var mongoose = require('mongoose');
var mongoController = require("./controller/mongoController.js");


mongoose.connect('mongodb://localhost:27017/musicSmoker');


app.use(express.json());

app.get('/api/playlists', mongoController.getPlaylists);

/*app.get('/api/playlists/:id', controller1.getPlaylist);*/

app.post('/api/playlists', mongoController.insertPlaylist);

app.put('/api/playlists/:id', mongoController.editPlaylist);

app.delete('/api/playlists/:id', mongoController.deletePlaylist);

//PORT
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));