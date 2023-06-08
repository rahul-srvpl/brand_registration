const express = require('express');
const passport = require('passport');
const authHelpers = require('../../utils/authHelpers');
const authenticateToken = require('../../middlewares/authenticateTokenB2C');
const authenticateLocal = require('../../middlewares/authenticateLocalB2C');
const checkRoles = require('../../middlewares/checkRoles');
const { client_url, client_domain } = require('../../../config/vars');

const { change } = require('../../controllers/auth_b2c/change');
const { forgot } = require('../../controllers/auth_b2c/forgot');
const { login } = require('../../controllers/auth_b2c/login');
const { logout } = require('../../controllers/auth_b2c/logout');
const { refresh } = require('../../controllers/auth_b2c/refresh');
const { register } = require('../../controllers/auth_b2c/register');
const { reset } = require('../../controllers/auth_b2c/reset');
const { activate } = require('../../controllers/auth_b2c/activate');

const router = express.Router();

router.post("/register", register);
router.post("/activate", activate);
router.post("/forgot-password", forgot);
router.post("/reset-password", reset);
router.post("/change-password", authenticateToken, change);
router.post("/logout", logout);
router.post("/refresh-token", refresh);
router.post("/login", authenticateLocal, login);

// Set tokens in cookies with domain
const cookieOptions = {
    domain: client_domain, // Set the domain to .21genx.com
    //httpOnly: true, // Set to true to prevent client-side JavaScript access
    //secure: true // Set to true if using HTTPS
};

// Google Login
router.get('/login/google', passport.authenticate('google-b2c', { scope: ['profile', 'email'] }));

router.get('/login/google/callback', passport.authenticate('google-b2c', { session: false }), (req, res) => {
    const { user } = req;
    const access_token = authHelpers.generateAccessToken(user);
    const refresh_token = authHelpers.generateRefreshToken();

    user.refreshToken = refresh_token;
    user.save();

    res.cookie('access_token', access_token, cookieOptions);
    res.cookie('refresh_token', refresh_token, cookieOptions);
    res.redirect(client_url);
});


// Facebook Login
router.get('/login/facebook', passport.authenticate('facebook-b2c', { scope: ['public_profile', 'email'], session: false }), (req, res) => {
    const { user } = req;
    const access_token = authHelpers.generateAccessToken(user);
    const refresh_token = authHelpers.generateRefreshToken();

    user.refreshToken = refresh_token;
    user.save();

    res.cookie('access_token', access_token, cookieOptions);
    res.cookie('refresh_token', refresh_token, cookieOptions);
    res.redirect(client_url);
});

router.get('/login/facebook/callback', passport.authenticate('facebook-b2c', { session: false }), (req, res) => {
    const { user } = req;
    const access_token = authHelpers.generateAccessToken(user);
    const refresh_token = authHelpers.generateRefreshToken();

    user.refreshToken = refresh_token;
    user.save();

    res.cookie('access_token', access_token, cookieOptions);
    res.cookie('refresh_token', refresh_token, cookieOptions);
    res.redirect(client_url);
});


// Protected route
router.get('/protected', authenticateToken, (req, res) => {
    const user = req.user;
    res.json({ message: `Hello, ${user.email}! This is a protected route.` });
});

// Protected route accessible to "b2b" role
router.get('/check-role', authenticateToken, checkRoles(['b2c']), (req, res) => {
    const user = req.user;
    res.json({ message: `Hello, ${user.email}! This is an b2c-only route.` });
});

// Protected route accessible to "social user" role
router.get('/check-role/social', authenticateToken, checkRoles(['google', 'facebook']), (req, res) => {
    const user = req.user;
    res.json({ message: `Hello, ${user.email}! This is a social-only route.` });
});

module.exports = router;
