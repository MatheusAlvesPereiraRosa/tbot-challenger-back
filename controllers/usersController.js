require('dotenv').config()

const User = require('../models/users'); // Import the User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = process.env

// Define functions for user registration, login, etc.
module.exports = {
  registerUser: async (req, res) => {
    const { username, password } = req.body;

    try {
      // Check if the username already exists
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user record
      const newUser = new User({
        username,
        password: hashedPassword,
      });

      // Save the user to the database
      await newUser.save();

      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ message: 'Failed to register user' });
    }
  },

  loginUser: async (req, res) => {
    const { username, password } = req.body;

    try {
      // Find the user by username
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate a JSON Web Token (JWT) for authentication
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
        expiresIn: '1h',
      });

      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Failed to log in' });
    }
  },
};