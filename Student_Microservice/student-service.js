const express = require('express');
const app = express();

app.get('/viewbooks', (req, res) => {
    res.send('<html><body>INSIDE STUDENT VIEW BOOKS API..</body></html>');
});

app.post('/borrowbook', (req, res) => {
    res.send('<html><body>INSIDE STUDENT BORROW BOOK API..</body></html>');
});

app.post('/returnbook', (req, res) => {
    res.send('<html><body>INSIDE STUDENT RETURN BOOK API..</body></html>');
});

app.listen(5002, () =>
    console.log('Student Service Started at Port No: 5002'));
