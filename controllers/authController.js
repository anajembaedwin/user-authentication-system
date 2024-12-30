const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Refresh token storage (Use database or Redis in production)
const refreshTokens = [];

// Helper function to create tokens
const generateToken = (id, role, secret, expiresIn) => {
    return jwt.sign({ id, role }, secret, { expiresIn });
};


// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ name, email, password });
        await user.save();

        const token = generateToken(user._id, user.role, process.env.JWT_SECRET, '1h');
        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user._id, user.role, process.env.JWT_SECRET, '1h');
        const refreshToken = generateToken(user._id, user.role, process.env.JWT_REFRESH_SECRET, '7d');
        refreshTokens.push(refreshToken);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get current user (protected route)
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Request password reset
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetToken = user.getResetPasswordToken();
        await user.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        const message = `Reset your password using this link: ${resetUrl}`;

        await sendEmail({ email: user.email, subject: 'Password Reset', message });
        res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    try {
        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Refresh token
const refreshToken = (req, res) => {
    // Ensure cookies exist
    if (!req.cookies || !req.cookies.refreshToken) {
        return res.status(403).json({ message: 'Refresh token not found' });
    }

    const refreshToken = req.cookies.refreshToken;

    // Verify if the token exists in the stored refresh tokens list
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

    try {
        // Decode and verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Generate a new access token
        const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with the new token
        res.status(200).json({ token: newToken });
    } catch (error) {
        console.error('Error verifying refresh token:', error);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};


module.exports = { registerUser, loginUser, getUser, forgotPassword, resetPassword, refreshToken };
