const express = require('express');
const { chat, fetchChats, getChatMessages, deleteChat } = require('../controller/chatController');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');

// Route 1: Chat with Gemini using: POST "/api/chat". Login required
router.post('/chat', fetchUser, chat);

// Route 2: Fetch all chats for the user: GET "/api/fetchchats". Login required
router.get('/fetchchats', fetchUser, fetchChats);

// Route 3: Get specific chat messages: GET "/api/chat/:chatId". Login required
router.get('/chat/:chatId', fetchUser, getChatMessages);

// Route 4: Delete a chat: DELETE "/api/chat/:chatId". Login required
router.delete('/chat/:chatId', fetchUser, deleteChat);

module.exports = router;
