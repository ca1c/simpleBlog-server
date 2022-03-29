const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    userId: ObjectId,
    email: String,
    username: String,
    password: String,
    dateCreated: Date,
});

module.exports = User;