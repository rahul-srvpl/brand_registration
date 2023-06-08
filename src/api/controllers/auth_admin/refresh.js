const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authHelpers = require('../../utils/authHelpers');
const User = require('../../models/admin');
const { jwt_config, client_domain } = require('../../../config/vars');

exports.refresh = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        // Check if the refresh token is valid
        const decoded = jwt.verify(refreshToken, jwt_config.jwt_secret);

        // Find the user by the refresh token
        const user = await User.findOne({ refreshToken: refreshToken }).exec();

        if (!user) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // Generate a new access token
        const accessToken = authHelpers.generateAccessToken(user);

        // Generate a new refresh token
        const newRefreshToken = authHelpers.generateRefreshToken();

        // Update the refresh token in the database
        user.refreshToken = newRefreshToken;
        await user.save();
        
        // Set tokens in cookies with domain
        const cookieOptions = {
            domain: client_domain, // Set the domain to .21genx.com
            //httpOnly: true, // Set to true to prevent client-side JavaScript access
            //secure: true // Set to true if using HTTPS
        };

        res.cookie('access_token', accessToken, cookieOptions);
        res.cookie('refresh_token', newRefreshToken, cookieOptions);
        res.json({ userId: user._id, access_toekn: accessToken, refresh_token: newRefreshToken });
    } catch (err) {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
};