const mongoose = require("mongoose")
const { Schema } = mongoose;

const userSinginDB = new Schema({
    name: {
        type: String,
        required: true
    },
    emial: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    confirm_password: {
        type: String,
        required: true
    },

});

const User = mongoose.model('user', userSinginDB);
module.exports = userSinginDB

