const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
    role: {
        type: String,
        enum: ['user', 'model'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ChatSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true,
        default: "New Chat"
    },
    messages: [MessageSchema]
}, { timestamps: true });

const Chat = mongoose.model('chat', ChatSchema);
module.exports = Chat;
