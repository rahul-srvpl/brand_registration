const express = require('express');
const passport = require('passport');
const authHelpers = require('../../utils/authHelpers');
const authenticateToken = require('../../middlewares/authenticateTokenB2B');
const authenticateLocal = require('../../middlewares/authenticateLocalB2B');
const uploadMiddleware = require('../../middlewares/b2bDocUpload');
const checkRoles = require('../../middlewares/checkRoles');
const { client_url, client_domain } = require('../../../config/vars');


const { change } = require('../../controllers/auth_b2b/change');
const { forgot } = require('../../controllers/auth_b2b/forgot');
const { login } = require('../../controllers/auth_b2b/login');
const { logout } = require('../../controllers/auth_b2b/logout');
const { refresh } = require('../../controllers/auth_b2b/refresh');
const { register } = require('../../controllers/auth_b2b/register');
const { reset } = require('../../controllers/auth_b2b/reset');
const { activate } = require('../../controllers/auth_b2b/activate');

const router = express.Router();

router.post("/register", uploadMiddleware, register);
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
router.get('/login/google', passport.authenticate('google-b2b', { scope: ['profile', 'email'] }));

router.get('/login/google/callback', passport.authenticate('google-b2b', { session: false }), (req, res) => {
    const { user } = req;
    const access_token = authHelpers.generateAccessToken(user);
    const refresh_token = authHelpers.generateRefreshToken();

    user.refreshToken = refresh_token;
    user.save();

    if (user.isApproved === false) {
        res.redirect(`${client_url}/waiting`);
    }
    else {
        res.cookie('access_token', access_token, cookieOptions);
        res.cookie('refresh_token', refresh_token, cookieOptions);
        res.redirect(client_url);
    }
});

// Protected route
router.get('/protected', authenticateToken, (req, res) => {
    const user = req.user;
    res.json({ message: `Hello, ${user.email}! This is a protected route.` });
});

// Protected route accessible to "b2b" role
router.get('/check-role', authenticateToken, checkRoles(['b2b']), (req, res) => {
    const user = req.user;
    res.json({ message: `Hello, ${user.email}! This is an b2b-only route.` });
});

// Protected route accessible to "social user" role
router.get('/check-role/social', authenticateToken, checkRoles(['google', 'facebook']), (req, res) => {
    const user = req.user;
    res.json({ message: `Hello, ${user.email}! This is a social-only route.` });
});

module.exports = router;
