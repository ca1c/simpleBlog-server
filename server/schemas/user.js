const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    userId: ObjectId,
    email: { type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    posts: {type: [String], required: true},
    dateCreated: {type: Date, default: Date.now()},
});

module.exports = mongoose.model("User", UserSchema);