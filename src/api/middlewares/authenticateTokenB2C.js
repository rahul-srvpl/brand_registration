const passport = require('passport');

const authenticateToken = passport.authenticate('jwt-b2c', { session: false });

module.exports = authenticateToken;