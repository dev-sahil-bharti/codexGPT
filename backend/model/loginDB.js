const mongoose = require("mongoose")
const { Schema } = mongoose;

const loginDB = new Schema({
    emial: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('user', loginDB);
module.exports = loginDB

