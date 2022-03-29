const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const app = express();

require('dotenv').config();
const PORT = 8080 || process.env.PORT;

const api = require('./routes/api.js');

mongoose.connect(`${process.env.DB_URL}${process.env.DB_NAME}`);

//schemas
const User = require('./schemas/user.js');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

// User.authenticate is located in /schemas/user.js in the passport plugin
passport.use(new LocalStrategy(User.authenticate()));

app.get('/', (req, res) => {
    res.send('test');
});

app.use('/api', api);

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});