const checkRoles = (roles) => (req, res, next) => {
    if (req.user && roles.some((role) => req.user.roles.includes(role))) {
        return next();
    }
    return res.status(403).json({ error: 'Access denied' });
};

module.exports = checkRoles;