const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    sessionId: String,
    expires: Date,
    session: Object,
});

module.exports = mongoose.model("Session", SessionSchema);