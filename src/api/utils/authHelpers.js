const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwt_config } = require('../../config/vars');

// Helper functions
exports.generateAccessToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        roles: user.roles,
    };
    return jwt.sign(payload, jwt_config.jwt_secret, { expiresIn: jwt_config.jwt_expiration });
};

exports.generateRefreshToken = () => jwt.sign({}, jwt_config.jwt_secret, { expiresIn: jwt_config.refresh_token_expiration });

exports.hashPassword = async (password) => {
    const saltRounds = parseInt(jwt_config.salt_rounds);
    return bcrypt.hash(password, saltRounds);
};

exports.comparePasswords = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

