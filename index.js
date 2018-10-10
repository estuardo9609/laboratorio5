const express = require('express');
const app = express();
var controller1 = require("./controller/controller.js");

app.use(express.json());

app.get('/api/playlists', controller1.getPlaylists);

app.get('/api/playlists/:id', controller1.getPlaylist);

app.post('/api/playlists', controller1.postPlaylist);

app.put('/api/playlists/:id', controller1.putPlaylist);

app.delete('/api/playlists/:id', controller1.deletePlaylist);

//PORT
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));