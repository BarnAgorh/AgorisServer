const express = require('express')
const router = express.Router()

const {protect} = require('../middlewares/auth')

const {
    chatHistory,
} = require('../controllers/chats')

router.post('/chat-history', protect, chatHistory)

module.exports = router