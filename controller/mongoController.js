var mongoose = require('mongoose');
var Playlist = require('../model/mongoPlaylist');
var redis = require('redis');
var client = redis.createClient('redis://redis');


var playlist = new Playlist();

exports.getPlaylists = (req, res, next) => {

    client.get('allPlaylists', function(err,reply) {
        if(reply){
            res.status(200).send(reply);
        }
        else{
            playlist.getAll(function(err, playlists){
                if(err) return res.status(500).send(err.message);
                client.set('allPlaylists',JSON.stringify(playlists));
                res.status(200).jsonp(playlists);
            });
        }

});

};
    
exports.getPlaylist = function (req, res) {
    var playlistId = req.params.id;
    client.get(playlistId, function(err,reply){
        if(reply){
            res.status(200).send(reply);
        }
        else{
            if(playlistId == null || playlistId.length == 0)
            return res.status(400).jsonp({message: "Falta el id de la playlist"});
        
            playlist.findById(playlistId, function(err, playlists){
            if(err) return res.status(400).jsonp({message: "Playlist no encontrada"});
            if(playlists.length != 1)
                return res.status(400).jsonp({message: "No se encontro la playlist"});
            var foundedPlaylist = playlists[0];
            client.set(playlistId,JSON.stringify(foundedPlaylist));
            res.status(200).jsonp(foundedPlaylist);
        });
        }
    });
    
}

exports.insertPlaylist = function (req, res) {
    console.log("POST - /playlist");
    var newPlaylist = req.body;

    playlist = new Playlist();
    playlist._id         = mongoose.Types.ObjectId();
    playlist.name      = newPlaylist.name;
    playlist.description = newPlaylist.description;
    playlist.genre = newPlaylist.genre;
    playlist.rate = newPlaylist.rate;
    playlist.author = newPlaylist.author;
    playlist.hide = true;


    playlist.save(function(err,savedPlaylist){
        if(err) return res.status(500).send(err.message);
        client.del('allPlaylists');
        client.set(savedPlaylist._id.toString(), JSON.stringify(savedPlaylist));
        res.status(200).jsonp(savedPlaylist);
    });
    
}

exports.editPlaylist = function (req, res) {
    console.log("PUT - /playlist");
    var playlistId = req.params.id;
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
            client.del(playlistId);
            client.del('allPlaylists');
            res.status(200).jsonp(savedPlaylist);
        });
    });

}

exports.deletePlaylist = function (req, res) {
    var playlistId = req.params.id;
    if(playlistId == null || playlistId.length == 0)
        return res.status(400).jsonp({message: "Falta el id de la playlist"});
    
    playlist.findById(playlistId, function(err, playlists){
        if(err) return res.status(400).jsonp({message: "Playlist no encontrada"});
        if(playlists.length != 1)
            return res.status(400).jsonp({message: "No se encontro la playlist"});
        var foundedPlaylist = playlists[0];
        foundedPlaylist.remove(function(err){
            if(err) return res.status(400).jsonp({message: "La playlist no pudo ser eliminada"});      
            client.del(playlistId); 
            client.del('allPlaylists');         
            return res.status(200).jsonp({message: "Playlist eliminada"});
        });
    });
}