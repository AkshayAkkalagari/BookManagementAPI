const mongoose = require("mongoose");

//create Author Schema
const AuthorSchema = mongoose.Schema(
    {
        id: Number,
        name: String,
        books: [String]
    }
);

const AuthorModel = mongoose.model("Auhtor",AuthorSchema);

module.exports = AuthorModel;
