var mongoose = require('mongoose');
var Playlist = mongoose.model('Playlist');

var playlist = new Playlist({});

exports.getPlaylists = function (req, res) {
    console.log("GET playlist");

    curso.getAll(function(err, playlists){
        if(err) return res.status(500).send(err.message);
        res.status(200).jsonp(playlists);
    });

}

exports.insertPlaylist = function (req, res) {
    console.log("POST - /playlist");
    var newPlaylist = req.body;

    playlist._id         = mongoose.Types.ObjectId();
    playlist.name      = newPlaylist.name;
    playlist.description = newPlaylist.description;
    playlist.genre = newPlaylist.genre;
    playlist.rate = newPlaylist.rate;
    playlist.author = newPlaylist.athor;


    playlist.save(function(err,savedPlaylist){
        if(err) return res.status(500).send(err.message);
        res.status(200).jsonp(savedPlaylist);
    });
    
}

exports.editPlaylist = function (req, res) {
    console.log("PUT - /playlist");
    var playlistId = req.params.playlistId;
    var updatedPlaylist = req.body;

    if(playlistId == null || playlistId.length == 0)
        return res.status(400).jsonp({message: "Falta el id de playlist"});

    playlist.findById(playlistId, function(err, playlists) {
        if(err) return res.status(400).jsonp({message:"Playlist no encontrado"});
        if(playlists.length != 1) return res.status(400).jsonp({message:"No se encontro el playlist"});
        var foundedPlaylist = playlists[0];

        foundedPlaylist.id     = updatedPlaylist.id;
        foundedPlaylist.name= updatedPlaylist.name;
        foundedPlaylist.description = updatedPlaylist.description;
        foundedPlaylist.genre = updatedPlaylist.genre;
        foundedPlaylist.rate = updatedPlaylist.rate;
        foundedPlaylist.author = updatedPlaylist.author;

        foundedPlaylist.save(function(err, savedPlaylist){
            if(err) return res.status(500).send(err.message);
            res.status(200).jsonp(savedPlaylist);
        });
    });

}

exports.deletePlaylist = function (req, res) {
    var playlistId = req.params.playlistId;
    if(playlistId == null || playlistId.length == 0)
        return res.status(400).jsonp({message: "Falta el id de la playlist"});
    
    playlist.findById(playlistId, function(err, playlists){
        if(err) return res.status(400).jsonp({message: "Playlist no encontrada"});
        if(playlist.length != 1)
            return res.status(400).jsonp({message: "No se encontro la playlist"});
        var foundedPlaylist = playlists[0];
        foundedPlaylist.remove(function(err){
            if(err) return res.status(400).jsonp({message: "La playlist no pudo ser eliminada"});                
            return res.status(200).jsonp({message: "Playlist eliminada"});
        });
    });
}