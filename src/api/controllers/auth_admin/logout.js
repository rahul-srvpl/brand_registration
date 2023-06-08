const mongoose = require('mongoose');
const User = require('../../models/admin');

exports.logout = async (req, res) => {
    try {
        // Get the user ID from the request or the currently logged-in user
        const userId = req.userId || req.user._id;

        // Clear the refresh token from the user in the database
        await User.findByIdAndUpdate(userId, { refreshToken: null });

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'An error occurred during logout' });
    }
};