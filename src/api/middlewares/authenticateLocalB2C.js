const passport = require('passport');

const authenticateLocal = passport.authenticate('local-b2c', { session: false });

module.exports = authenticateLocal;