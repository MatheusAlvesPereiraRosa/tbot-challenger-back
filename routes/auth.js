// routes/auth.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

// Define routes for user registration and login
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;