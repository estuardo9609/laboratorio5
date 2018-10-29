const express = require('express');
const app = express();
var cors = require('cors');
/*var controller1 = require("./controller/controller.js");*/
var mongoController = require("./controller/mongoController.js");
var mongoDatabase = require("./Database/database");

app.use(express.json());
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/playlists', mongoController.getPlaylists);

app.get('/api/playlists/:id', mongoController.getPlaylist);

app.post('/api/playlists', mongoController.insertPlaylist);

app.put('/api/playlists/:id', mongoController.editPlaylist);

app.delete('/api/playlists/:id', mongoController.deletePlaylist);

//PORT
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));