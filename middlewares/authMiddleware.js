const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const token = req.header('Authorization')?.split(' ')[1]; // Extract token after "Bearer"
    // console.log('Authorization Header:', req.header('Authorization'));
    // console.log('Token:', token);
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded token:', decoded);  // Log decoded token
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
