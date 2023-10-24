const express = require('express');
const protectRoute = require('../middleware/userAuth');
const messagesController = require('../controllers/messagesController');
const router = express.Router();

// Rotas relacionadas as mensagens
router.get('/messages/:chatId', protectRoute, messagesController.getMessageFromChatId);
router.get('/getHistory', protectRoute, messagesController.getHistory)
router.get('/getChats', protectRoute, messagesController.getChats)
router.post('/sendMessage', protectRoute, messagesController.sendMessage);

module.exports = router;