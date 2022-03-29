const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Schemas
const User = require('../schemas/user.js');

// no need for body parser here because exporting router to main file
// so req.body is perfectly fine

router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const Users = new User({email, username});
    User.register(Users, password, function(err, user) {
        if(err) {
            res.json({success: false, message: "Account could not be registered. Error: ", err});
        } else {
            res.json({success: true, message: "Account has been created successfully"});
        }
    })

})
router.post('/login', () => {
    console.log(req.body);
    res.send('200');
})

module.exports = router;