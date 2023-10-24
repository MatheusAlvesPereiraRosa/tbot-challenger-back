require('dotenv').config()

const User = require('../models/users');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env

// Definindo funções que envolvem a autenticação de usuário
module.exports = {
  registerUser: async (req, res) => {
    const { username, password } = req.body;

    try {
      // Checando se o nome de usuário já existe
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Gerando hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criando um novo usuário
      const newUser = new User({
        username,
        password: hashedPassword,
      });

      // Salvando o usuário no banco de dados
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
      // Achando o usuário pelo nome
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Comparando as senhas
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Gerando o JWT para a autenticação
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
        expiresIn: '1h',
      });

      console.log("Login sucess")
      return res.status(200).cookie('token', token, { httpOnly: true }).json({ message: 'Login successful', token })
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Failed to log in' });
    }
  },

  resetPassword: async (req, res) => {
    const { username } = req.body;

    if (username === "" || !username) {
      return res.status(500).json({message: 'O nome do usuário não foi mandado'})
    } 
  
    // Procurando usuário no banco de dados
    const user = await User.findOne({ username });
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    // Gerando o token para redefinir a senha
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
  
    res.status(200).json({ message: 'Password reset token sent', token });
  },

  changePassword: async (req, res) => {
    const { token, password } = req.body;
  
    try {
      // Verificando o token
      const decodedToken = jwt.verify(token, 'your-secret-key');
  
      // Checando se o token expirou
      if (decodedToken.exp < Date.now() / 1000) {
        return res.status(400).json({ message: 'Token expired' });
      }
  
      // Achando usuário por ID
      const user = await User.findById(decodedToken.userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Gerando hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Atualizando a senha do usuário
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error during password reset:', error);
      res.status(500).json({ message: 'Failed to reset password' });
    }
  }
};