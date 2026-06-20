const schema_mongoose = require('mongoose');

const BookSchema = schema_mongoose.Schema(
    {
        bookid: { type: Number },
        title: { type: String },
        author: { type: String },
        quantity: { type: Number, default: 1 }
    },
    {
        timestamps: true
    }
);

module.exports = schema_mongoose.model('book_collection', BookSchema);
