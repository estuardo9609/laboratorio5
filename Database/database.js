var mongoose = require('mongoose');

class Database {
    constructor() {
      this._connect()
    }
  _connect() {
       mongoose.connect('mongodb://mongo:27017/musicSmoker')
         .then(() => {
           console.log('Database connection successful')
         })
         .catch(err => {
           console.error('Database connection error')
         })
    }
}

module.exports = new Database();