const jwt = require('jsonwebtoken');
require('dotenv').config();

function authorize(roles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(403).json({ message: 'No token' });

    const token = authHeader.split(' ')[1];
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      if (!roles.includes(user.role)) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
}

module.exports = authorize;
