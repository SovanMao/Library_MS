const express = require('express');
const app = express();

app.post('/addbook', (req, res) => {
    res.send('<html><body>INSIDE LIBRARIAN ADD BOOK API..</body></html>');
});

app.get('/viewbooks', (req, res) => {
    res.send('<html><body>INSIDE LIBRARIAN VIEW BOOKS API..</body></html>');
});

app.get('/updatebook', (req, res) => {
    res.send('<html><body>INSIDE LIBRARIAN UPDATE BOOK API..</body></html>');
});

app.delete('/deletebook', (req, res) => {
    res.send('<html><body>INSIDE LIBRARIAN DELETE BOOK API..</body></html>');
});

app.listen(5001, () =>
    console.log('Librarian Service Started at Port No: 5001'));
