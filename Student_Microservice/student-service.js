const express = require('express');
const os = require('os');
const app = express();

require('dotenv').config();
app.use(express.json());

const BookModel = require('./book_schema.js');
const dbconnect = require('./dbconnect.js');

// os.hostname() returns the container's hostname (student1 / student2),
// so every response shows which instance the load balancer routed to.
const INSTANCE = os.hostname();

// VIEW BOOKS API
app.get('/viewbooks', (req, res) => {
    BookModel.find()
        .then(books => res.status(200).json({ servedBy: INSTANCE, books }))
        .catch(err => res.status(500).json({ message: err.message || 'Error fetching books' }));
});

// BORROW BOOK API (send bookid) -> decrement quantity if available
app.post('/borrowbook', (req, res) => {
    BookModel.findOne({ bookid: req.body.bookid })
        .then(book => {
            if (!book) return res.status(404).json({ servedBy: INSTANCE, message: 'Book not found' });
            if (book.quantity <= 0) return res.status(400).json({ servedBy: INSTANCE, message: 'Book not available' });

            book.quantity -= 1;
            return book.save().then(saved =>
                res.status(200).json({ servedBy: INSTANCE, message: 'Book borrowed', book: saved }));
        })
        .catch(err => res.status(500).json({ servedBy: INSTANCE, message: err.message || 'Error borrowing book' }));
});

// RETURN BOOK API (send bookid) -> increment quantity
app.post('/returnbook', (req, res) => {
    BookModel.findOne({ bookid: req.body.bookid })
        .then(book => {
            if (!book) return res.status(404).json({ servedBy: INSTANCE, message: 'Book not found' });

            book.quantity += 1;
            return book.save().then(saved =>
                res.status(200).json({ servedBy: INSTANCE, message: 'Book returned', book: saved }));
        })
        .catch(err => res.status(500).json({ servedBy: INSTANCE, message: err.message || 'Error returning book' }));
});

app.listen(5002, () =>
    console.log('Student Service Started at Port No: 5002'));
