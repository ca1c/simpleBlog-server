const express = express();
const router = express.Router();
const mongoose = require('mongoose');

//Schemas
const User = require('../schemas/user');

// no need for body parser here because exporting router to main file
// so req.body is perfectly fine

router.post('/register', (req, res) => {
    console.log(req.body);
    res.send('200');
})
router.post('login', () => {
    console.log(req.body);
    res.send('200');
})

module.exports = router;