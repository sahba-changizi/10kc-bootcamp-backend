const mongoose = require("mongoose");
const User = require("./user.model");

const Photo = mongoose.model(
    "Photo",
    new mongoose.Schema({
        name: String,
        owner: User.schema,
        img:
            {
                data: Buffer,
                contentType: String
            }
    })
);

module.exports = Photo;
