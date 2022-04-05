const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const saltRounds = 10;

require('dotenv').config();

//Schemas
const User = require('../schemas/user.js');

const store = require('./util/mongostore.js');

// no need for body parser here because exporting router to main file
// so req.body is perfectly fine

const SECRET_KEY = process.env.SECRET_KEY;

router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        User.findOne({ username: username }, function(err, user) {
            // user will have a value of null if no user is found
            if(user) {
                res.send({ success: false, message: "Error Registering Account", sessID: req.session.id });
                return;
            }
            else {
                const user = new User({
                    username,
                    email,
                    password: hash
                });
        
                user.save().then(() => {
                    req.session.user = username;
                    req.session.save();
                    res.send({ success: true, message: "Account Successfully Registered", sessID: req.session.id});
                    console.log('new user registered');
                    console.log(req.session);
                });
            }
        });


    })
})

router.post('/login', (req, res) => {
    const {username, password} = req.body;
    User.findOne({ username : username }, function(err, user) {
        if(!user) {
            res.send({ success: false, message: "Username or Password Incorrect" })
            return;
        }
        else {
            bcrypt.compare(password, user.password, function(err, result) {
                if(result) {
                    req.session.user = username;
                    req.session.save();
                    res.send({ success: true, message: "Successfully Logged In", sessID: req.session.id });
                }
                else {
                    res.send({ success: false, message: "Username or Password Incorrect" })
                }
            })
        }
    })
})

router.get('/authenticate', (req, res) => {
    store.get(req.query.sessId, function(error, session) {
        if (error) {
            res.status(500).send(error);
            return;
        }
        res.send({success: true, message: "authenticated", username: session.user});
    })
})

module.exports = router;