const express = require('express');
const authenticateToken = require('../../middlewares/authenticateTokenAdmin');
const authenticateLocal = require('../../middlewares/authenticateLocalAdmin');
const checkRoles = require('../../middlewares/checkRoles');

const { change } = require('../../controllers/auth_admin/change');
const { forgot } = require('../../controllers/auth_admin/forgot');
const { login } = require('../../controllers/auth_admin/login');
const { logout } = require('../../controllers/auth_admin/logout');
const { refresh } = require('../../controllers/auth_admin/refresh');
const { register } = require('../../controllers/auth_admin/register');
const { reset } = require('../../controllers/auth_admin/reset');
const { activate } = require('../../controllers/auth_admin/activate');

const router = express.Router();

router.post("/register", register);
router.post("/activate", activate);
router.post("/forgot-password", forgot);
router.post("/reset-password", reset);
router.post("/change-password", authenticateToken, change);
router.post("/logout", logout);
router.post("/refresh-token", refresh);
router.post("/login", authenticateLocal, login);

// Protected route
router.get('/protected', authenticateToken, (req, res) => {
    const user = req.user;
    res.json({ message: `Hello, ${user.email}! This is a protected route.` });
});

// Protected route accessible to "admin" role
router.get('/check-role', authenticateToken, checkRoles(['admin']), (req, res) => {
    const user = req.user;
    res.json({ message: `Hello, ${user.email}! This is an admin-only route.` });
});

module.exports = router;
