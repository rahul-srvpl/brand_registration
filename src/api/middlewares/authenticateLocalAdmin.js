const passport = require('passport');

const authenticateLocal = passport.authenticate('local-admin', { session: false });

module.exports = authenticateLocal;