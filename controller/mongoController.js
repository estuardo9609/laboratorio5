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
    console.log("GET - /playlist");
    var playlistId = req.params.id;

    client.get(playlistId, function(err,reply){
        if(reply){
            res.status(200).send(reply);
        }
        else{
            if(playlistId == null || playlistId.length == 0)
            return res.status(400).jsonp({message: "Falta el id de la playlist."});
        
            playlist.findById(playlistId, function(err, playlists){
            if(err) return res.status(400).jsonp({message: "Playlist no encontrada."});
            if(playlists.length != 1)
                return res.status(400).jsonp({message: "No se encontro la playlist."});
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

    //Validation
    if(validation(1,req.body.name)) return res.status(400).jsonp({message:"El nombre de la playlist no es valido."})
    if(validation(1,req.body.description)) return res.status(400).jsonp({message:"La descripcion no es valida."})
    if(validation(1,req.body.genre)) return res.status(400).jsonp({message:"El genero no es valido."})
    if(validation(2,req.body.rate)) return res.status(400).jsonp({message:"Debe seleccionar una calificación entre 1 y 5."})
    if(validation(1,req.body.author)) return res.status(400).jsonp({message:"El autor de la playlist no es valido."})

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

    //Validations
    if(validation(1,req.body.name)) return res.status(400).jsonp({message:"El nombre de la playlist no es valido."})
    if(validation(1,req.body.description)) return res.status(400).jsonp({message:"La descripcion no es valida."})
    if(validation(1,req.body.genre)) return res.status(400).jsonp({message:"El genero no es valido."})
    if(validation(2,req.body.rate)) return res.status(400).jsonp({message:"Debe seleccionar una calificación entre 1 y 5."})
    if(validation(1,req.body.author)) return res.status(400).jsonp({message:"El autor de la playlist no es valido."})

    var updatedPlaylist = req.body;

    if(playlistId == null || playlistId.length == 0)
        return res.status(400).jsonp({message: "Falta el id de playlist."});

    playlist.findById(playlistId, function(err, playlists) {
        if(err) return res.status(400).jsonp({message:"Playlist no encontrado."});
        if(playlists.length != 1) return res.status(400).jsonp({message:"No se encontro el playlist."});
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
    console.log("DELETE - /playlist");
    var playlistId = req.params.id;
    if(playlistId == null || playlistId.length == 0)
        return res.status(400).jsonp({message: "Falta el id de la playlist."});
    
    playlist.findById(playlistId, function(err, playlists){
        if(err) return res.status(400).jsonp({message: "Playlist no encontrada."});
        if(playlists.length != 1)
            return res.status(400).jsonp({message: "No se encontro la playlist."});
        var foundedPlaylist = playlists[0];
        foundedPlaylist.remove(function(err){
            if(err) return res.status(400).jsonp({message: "La playlist no pudo ser eliminada."});      
            client.del(playlistId); 
            client.del('allPlaylists');         
            return res.status(200).jsonp({message: "Playlist eliminada."});
        });
    });
}

function validation (selector, param){
    try {
        if(param.length = 0) return true;
        switch(selector){
            case 1: 
                if (/[a-z]+/i.test(param)){
                    return false;
                } 
                break;
            case 2:
                if (/[1-5]+/.test(param)) return false;
                break;
            default:
                return true;
        }
        return true;
    }
    catch(err) {
       return true;
    }
} 


