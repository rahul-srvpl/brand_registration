const passport = require('passport');

const authenticateToken = passport.authenticate('jwt-admin', { session: false });

module.exports = authenticateToken;