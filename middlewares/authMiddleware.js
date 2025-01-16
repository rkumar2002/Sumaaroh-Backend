const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Extract userId from token
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};


module.exports = { authMiddleware };