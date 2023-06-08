const passport = require('passport');

const authenticateLocal = passport.authenticate('local-b2b', { session: false });

module.exports = authenticateLocal;