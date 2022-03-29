const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Schemas
const User = require('../schemas/user.js');
const passport = require('passport');

// no need for body parser here because exporting router to main file
// so req.body is perfectly fine

const SECRET_KEY = process.env.SECRET_KEY;

router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    if(!username || !email || !password) return 'Error: Missing data';
    const Users = new User({email, username});
    User.register(Users, password, function(err, user) {
        if(err) {
            res.json({success: false, message: "Account could not be registered. Error: ", err});
        } else {
            res.json({success: true, message: "Account has been created successfully"});
        }
    })
})

router.post('/login', (req, res) => {
    const {username, password} = req.body;
    console.log(username, password);
    passport.authenticate('local', function(err, user, info) {
            req.login(user, function(err) {
                if(err) {
                    res.json({success: false, message: err})
                    console.log(err);
                } else {
                    const token =  jwt.sign({userId : user._id, username:user.username}, 'keyboard cat', {expiresIn: '24h'})
                    res.json({success:true, message:"Authentication successful", token: token });
                }
            })
    })(req, res);
})

module.exports = router;