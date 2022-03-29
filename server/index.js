const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 8080;

require('dotenv').config();

const api = require('./routes/api.js');

mongoose.connect(`${process.env.DB_URL}${process.env.DB_NAME}`);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('test');
});

app.use('/api', api);

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});