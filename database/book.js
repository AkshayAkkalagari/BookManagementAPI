const mongoose = require("mongoose");

//create book Schema
const BookSchema = mongoose.Schema(
    {
        ISBN: String,
        title: String,
        PubDtae: String,
        language: String,
        numPage: Number,
        author: [Number],
        publications: [Number],
        category: [String]
    }
);

const BookModel = mongoose.model("Books",BookSchema);

module.exports = BookModel;
