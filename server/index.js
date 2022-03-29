const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;

const api = require('./routes/api.js');

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