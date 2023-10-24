require('dotenv').config()

const User = require('../models/users');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env

// Definindo funções que envolvem a autenticação de usuário
module.exports = {
  registerUser: async (req, res) => {
    const { username, password } = req.body;

    if (username === '' || undefined) {
      return res.status(500).json({message: 'O nome do usuário não foi informado'})
    }

    if (password === '' || undefined) {
      return res.status(500).json({message: 'A senha não foi informada'})
    }

    try {
      // Checando se o nome de usuário já existe
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return res.status(400).json({ message: 'Nome de usuário já existe' });
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

      return res.status(200).json({ message: 'Usuário cadastrado com sucesso' });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ message: 'Failed to register user' });
    }
  },

  loginUser: async (req, res) => {
    const { username, password } = req.body;

    if (username === '' || undefined) {
      return res.status(500).json({message: 'O nome do usuário não foi informado'})
    }

    if (password === '' || undefined) {
      return res.status(500).json({message: 'A senha não foi informada'})
    }

    try {
      // Achando o usuário pelo nome
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ message: 'Usuário inválido' });
      }

      // Comparando as senhas
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Senha inválida' });
      }

      // Gerando o JWT para a autenticação
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
        expiresIn: '1h',
      });

      console.log("Login sucess")
      return res.status(200).cookie('token', token, { httpOnly: true }).json({ message: 'Login bem sucedido', token })
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Falha ao logar' });
    }
  },

  resetPassword: async (req, res) => {
    const { username } = req.body;

    if (username === '' || undefined || !username) {
      return res.status(400).json({message: 'O nome do usuário não foi informado'})
    }
  
    // Procurando usuário no banco de dados
    const user = await User.findOne({ username });
  
    if (!user) {
      return res.status(404).json({ message: 'Usuário inexistente' });
    }
  
    // Gerando o token para redefinir a senha
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
  
    res.status(200).json({ message: 'Token para resetar senha enviado', token });
  },

  changePassword: async (req, res) => {
    const { token, password } = req.body;

    if (password === '' || undefined) {
      return res.status(400).json({message: 'A senha não foi informada'})
    }
  
    try {
      // Verificando o token
      const decodedToken = jwt.verify(token, SECRET_KEY);
  
      // Checando se o token expirou
      if (decodedToken.exp < Date.now() / 1000) {
        return res.status(400).json({ message: 'Token expirado' });
      }
  
      // Achando usuário por ID
      const user = await User.findById(decodedToken.userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuário não achado' });
      }
  
      // Gerando hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Atualizando a senha do usuário
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Senha mudada com sucesso' });
    } catch (error) {
      console.error('Erro durante o reset da senha', error);
      res.status(500).json({ message: 'Falha ao resetar senha' });
    }
  }
};