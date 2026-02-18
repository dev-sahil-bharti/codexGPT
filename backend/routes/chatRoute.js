const express = require('express');
const { chat } = require('../controller/chatController');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');

// Route 1: Chat with Gemini using: POST "/api/chat". Login required
router.post('/chat', fetchUser, chat);

module.exports = router;
