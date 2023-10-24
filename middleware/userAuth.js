const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

function authenticateUser(req, res, next) {
  const token = req.header('Authorization');

  if (!token || token === undefined) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify the token

    // Attach user information to the request object
    req.user = decoded.user;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authenticateUser;