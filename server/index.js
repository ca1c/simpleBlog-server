const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();

require('dotenv').config();
const PORT = 8080 || process.env.PORT;

const api = require('./routes/api.js');

const CONNECTION = `mongodb://localhost:27017/${process.env.DB_NAME}`;

mongoose.connect(CONNECTION);

//schemas
const User = require('./schemas/user.js');

var store = require('./routes/util/mongostore.js');

store.on('error', function(error) {
    console.log(error);
})



app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_KEY,
    cookie: {
        maxAge: 1000 * 60 * 5 // 5 min (just for dev purposes),
    },
    store: store,
    resave: true,
    saveUninitialized: true,
}))

app.use('/api', api);

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});