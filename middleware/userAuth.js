const jwt = require('jsonwebtoken');
const {SECRET_KEY} = process.env

function protectRoute(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Replace 'your-secret-key' with your actual secret key

    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = protectRoute;