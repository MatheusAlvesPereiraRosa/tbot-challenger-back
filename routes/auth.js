// routes/auth.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const authenticateUser = require('../middleware/userAuth');

// Define routes for user registration and login
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/resetPassword', userController.resetPassword);
router.post('/changePassword', userController.changePassword);
router.get('/protected', authenticateUser, (req, res) => {
  res.json({ message: 'You have access to this protected route' });
});
router.get('/logout', userController.logout)

module.exports = router;