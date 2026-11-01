const express = require('express');
const { askAI } = require('../controllers/chatbotController');
const router = express.Router();

router.post('/ask', askAI);

module.exports = router;