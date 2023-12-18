const mongoose = require('mongoose');
const {dbHost, dbName, dbPort} = require('../app/config');

mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}?authSource=admin`);
const db = mongoose.connection;
console.log('database running');

module.exports = db;