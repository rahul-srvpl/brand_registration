const mongoose = require('mongoose');
const authHelpers = require('../../utils/authHelpers');
const { client_domain } = require('../../../config/vars');

exports.login = async (req, res) => {
    const user = req.user;

    // Generate tokens
    const accessToken = authHelpers.generateAccessToken(user);
    const refreshToken = user.refreshToken;

    // Set tokens in cookies with domain
    const cookieOptions = {
        domain: client_domain, // Set the domain to .21genx.com
        //httpOnly: true, // Set to true to prevent client-side JavaScript access
        //secure: true // Set to true if using HTTPS
    };

    res.cookie('access_token', accessToken, cookieOptions);
    res.cookie('refresh_token', refreshToken, cookieOptions);
    res.json({ userId: user._id, access_token: accessToken, refresh_token: refreshToken });
};