const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const BlogPostSchema = new Schema({
    username: {type: String, required: true, unique: false},
    title: {type: String, required: true, unique: false},
    subheading: {type: String, required: true, unique: false},
    bodyText: {type: String, required: true, unique: false},
    dateCreated: {type: Date, default: Date.now()},
});

module.exports = mongoose.model("BlogPost", BlogPostSchema);