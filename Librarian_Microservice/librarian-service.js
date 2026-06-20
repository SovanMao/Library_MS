const express = require("express");
const app = express();

require("dotenv").config();
app.use(express.json());

const BookModel = require("./book_schema.js");
const dbconnect = require("./dbconnect.js");

function uniqueid(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// ADD BOOK API
app.post("/addbook", (req, res) => {
  const book = new BookModel({
    bookid: uniqueid(1000, 9999),
    title: req.body.title,
    author: req.body.author,
    quantity: req.body.quantity,
  });

  book
    .save()
    .then((saved) =>
      res.status(200).json({ message: "Book added", book: saved }),
    )
    .catch((err) =>
      res.status(500).json({ message: err.message || "Error adding book" }),
    );
});

// VIEW BOOKS API
app.get("/viewbooks", (req, res) => {
  BookModel.find()
    .then((books) => res.status(200).json(books))
    .catch((err) =>
      res.status(500).json({ message: err.message || "Error fetching books" }),
    );
});

// UPDATE BOOK API (send bookid + fields to change)
app.put("/updatebook", (req, res) => {
  BookModel.findOneAndUpdate(
    { bookid: req.body.bookid },
    {
      title: req.body.title,
      author: req.body.author,
      quantity: req.body.quantity,
    },
    { new: true, omitUndefined: true },
  )
    .then((updated) => {
      if (!updated) return res.status(404).json({ message: "Book not found" });
      res.status(200).json({ message: "Book updated", book: updated });
    })
    .catch((err) =>
      res.status(500).json({ message: err.message || "Error updating book" }),
    );
});

// DELETE BOOK API
app.delete("/deletebook", (req, res) => {
  BookModel.findOneAndDelete({ bookid: req.body.bookid })
    .then((deleted) => {
      if (!deleted) return res.status(404).json({ message: "Book not found" });
      res.status(200).json({ message: "Book deleted", book: deleted });
    })
    .catch((err) =>
      res.status(500).json({ message: err.message || "Error deleting book" }),
    );
});

app.listen(5001, () =>
  console.log("Librarian Service Started at Port No: 5001"),
);
