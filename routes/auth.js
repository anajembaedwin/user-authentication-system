const express = require('express');
const router = express.Router();
const { refreshToken,forgotPassword, resetPassword, registerUser, loginUser, getUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/refresh-token', refreshToken);

router.get('/admin', authMiddleware, authorize(['admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome Admin' });
});

module.exports = router;
