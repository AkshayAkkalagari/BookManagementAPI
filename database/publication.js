const mongoose = require("mongoose");

//create publication Schema
const PublicationSchema = mongoose.Schema(
    {
        id: Number,
        name: String,
        books: [String]
    }
);

const PublicationModel = mongoose.model("Publication",PublicationSchema);

module.exports = PublicationModel;
