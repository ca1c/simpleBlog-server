const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('test');
})

app.post('/login', (req, res) => {
    console.log(req.body);
    res.send('200');
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});