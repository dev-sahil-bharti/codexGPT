const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../model/Chat");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// Route 1: Send a message and get response (saves to history)
const chat = async (req, res) => {
    try {
        const { prompt, chatId } = req.body;
        const userId = req.user.id;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        let currentChat;

        if (chatId) {
            currentChat = await Chat.findOne({ _id: chatId, user: userId });
            if (!currentChat) {
                return res.status(404).json({ error: "Chat not found" });
            }
        } else {
            // Create a new chat if no chatId is provided
            // Use the first 30 chars of prompt as title
            const title = prompt.substring(0, 30) + (prompt.length > 30 ? "..." : "");
            currentChat = new Chat({
                user: userId,
                title: title,
                messages: []
            });
        }

        // Prepare context for Gemini
        const history = currentChat.messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        const chatSession = model.startChat({
            history: history,
        });

        const result = await chatSession.sendMessage(prompt);
        const responseText = result.response.text();

        console.log(`✅ Gemini Response Success [${model.model}]`);

        // Save messages to DB
        currentChat.messages.push({ role: 'user', content: prompt });
        currentChat.messages.push({ role: 'model', content: responseText });
        await currentChat.save();

        res.json({
            response: responseText,
            chatId: currentChat._id,
            title: currentChat.title
        });

    } catch (err) {
        console.error("Chat Error:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Route 2: Fetch all chat summaries for the user
const fetchChats = async (req, res) => {
    try {
        const userId = req.user.id;
        const chats = await Chat.find({ user: userId })
            .select('title updatedAt')
            .sort({ updatedAt: -1 });

        res.json(chats);
    } catch (err) {
        console.error("Fetch Chats Error:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Route 3: Get full message history for a specific chat
const getChatMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const { chatId } = req.params;

        const chat = await Chat.findOne({ _id: chatId, user: userId });
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        res.json(chat);
    } catch (err) {
        console.error("Get Messages Error:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Route 4: Delete a chat
const deleteChat = async (req, res) => {
    try {
        const userId = req.user.id;
        const { chatId } = req.params;

        const chat = await Chat.findOneAndDelete({ _id: chatId, user: userId });
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        res.json({ success: true, message: "Chat deleted" });
    } catch (err) {
        console.error("Delete Chat Error:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { chat, fetchChats, getChatMessages, deleteChat };
