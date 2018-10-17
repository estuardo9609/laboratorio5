var mongoose = require('mongoose'),
    collectionName = 'playlists',
    modelName = 'Playlist',
    Schema = mongoose.Schema;

var playlistSchema = new Schema({
    _id: Schema.Types.ObjectId,
    id:Number,
    name: String,
    description: String,
    genre: String,
    rate: Number,
    author: String
}, {versionKey: false});

playlistSchema.methods.findById = function(activityId, callback){
    return this.model(modelName).find({_id : activityId}, callback);
};

playlistSchema.methods.findByName = function(name, callback){
    return this.model(modelName).find({name: name}).exec(callback);
};

playlistSchema.methods.getAll = function(callback){
    return this.model(modelName).find({}).exec(callback);
};

module.exports = mongoose.model(modelName, cursoSchema, collectionName);