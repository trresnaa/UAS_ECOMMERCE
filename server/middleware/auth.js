const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const db = req.app.locals.db;
    
    const [users] = await db.execute(
      'SELECT id, name, email, role, phone, avatar, isActive FROM users WHERE id = ?',
      [decoded.userId]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    const user = users[0];

    if (!user.isActive) {
      return res.status(401).json({ message: 'User account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth; 