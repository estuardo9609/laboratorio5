
var models = require("../model/playlists.js");
myPlaylists= models.playlists;


exports.getPlaylists = function (req, res) {
    res.json(myPlaylists);
};

exports.getPlaylist = function (req, res){
    let playlist = myPlaylists.find(c => c.id == parseInt(req.params.id));
    if(!playlist) res.status(404).send('El playlist que busca no se encuentra'); //404
    res.status(200).json(playlist);
};

exports.postPlaylist = function (req, res){
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
};

exports.putPlaylist = function (req, res){
    const playlist = myPlaylists.find(c => c.id == parseInt(req.params.id));
    if(!playlist) res.status(404).send('El playlist que busca no se encuentra'); //404
    
    playlist.name = req.body.name;
    playlist.description = req.body.description;
    playlist.genre = req.body.genre;
    playlist.rate = req.body.rate;
    playlist.hide = true;

    res.status(204).send(playlist);
};

exports.deletePlaylist = function (req, res){
    const playlist = myPlaylists.find(c => c.id == parseInt(req.params.id));
    if(!playlist) res.status(404).send('El playlist que busca no se encuentra'); //404
    
    const index = myPlaylists.indexOf(playlist);
    myPlaylists.splice(index,1);

    res.status(204).send(playlist);
};
