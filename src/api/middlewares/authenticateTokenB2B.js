const passport = require('passport');

const authenticateToken = passport.authenticate('jwt-b2b', { session: false });

module.exports = authenticateToken;