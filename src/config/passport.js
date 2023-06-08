const mongoose = require('mongoose');
const passport = require('passport');
const crypto = require('crypto');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');
const GoogleTokenStrategy = require('passport-google-oauth20').Strategy;
const FacebookTokenStrategy = require('passport-facebook').Strategy;
const UserB2C = require('../api/models/user_b2c');
const UserB2B = require('../api/models/user_b2b');
const UserAdmin = require('../api/models/admin');

const { jwt_config, google, facebook } = require('../config/vars');

const authHelpers = require('../api/utils/authHelpers');

// Passport.js configuration
const jwtStrategyB2C = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwt_config.jwt_secret,
    },
    async (payload, done) => {
        try {
            const user = await UserB2C.findById(payload.id);
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    }
);

const jwtStrategyB2B = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwt_config.jwt_secret,
    },
    async (payload, done) => {
        try {
            const user = await UserB2B.findById(payload.id);
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    }
);

const jwtStrategyAdmin = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwt_config.jwt_secret,
    },
    async (payload, done) => {
        try {
            const user = await UserAdmin.findById(payload.id);
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    }
);

const localStrategyB2C = new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await UserB2C.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Invalid email or password' });
            }

            const passwordMatch = await authHelpers.comparePasswords(password, user.password);
            if (!passwordMatch) {
                return done(null, false, { message: 'Invalid email or password' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
);


const localStrategyB2B = new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await UserB2B.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Invalid email or password' });
            }

            const passwordMatch = await authHelpers.comparePasswords(password, user.password);
            if (!passwordMatch) {
                return done(null, false, { message: 'Invalid email or password' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
);

const localStrategyAdmin = new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await UserAdmin.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Invalid email or password' });
            }

            const passwordMatch = await authHelpers.comparePasswords(password, user.password);
            if (!passwordMatch) {
                return done(null, false, { message: 'Invalid email or password' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
);


const googleTokenStrategyB2C = new GoogleTokenStrategy(
    {
        clientID: google.google_client_id,
        clientSecret: google.google_client_secret,
        callbackURL: google.google_callback_b2c,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserB2C.findOne({ email: profile.emails[0].value });
            if (!user) {
                // Create the user if it doesn't exist
                const name = `${profile.name.givenName} ${profile.name.familyName}`;
                user = new UserB2C({
                    email: profile.emails[0].value,
                    refreshToken: authHelpers.generateRefreshToken(),
                    roles: ['b2c', 'google'], // Assign a specific role for Google users
                    avatar: profile.photos[0].value, // Save the user's image URL
                    name: name // Set the user's personal name from the social profile
                });
                await user.save();
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
);

const googleTokenStrategyB2B = new GoogleTokenStrategy(
    {
        clientID: google.google_client_id,
        clientSecret: google.google_client_secret,
        callbackURL: google.google_callback_b2b,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserB2B.findOne({ email: profile.emails[0].value });
            if (!user) {
                // Create the user if it doesn't exist
                const name = `${profile.name.givenName} ${profile.name.familyName}`;
                user = new UserB2B({
                    email: profile.emails[0].value,
                    refreshToken: authHelpers.generateRefreshToken(),
                    roles: ['b2b', 'google'], // Assign a specific role for Google users
                    avatar: profile.photos[0].value, // Save the user's image URL
                    personal_name: name, // Set the user's personal name from the social profile
                    isActivated: true
                });
                await user.save();
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
);

const facebookTokenStrategyB2C = new FacebookTokenStrategy(
    {
        clientID: facebook.facebook_app_id,
        clientSecret: facebook.facebook_app_secret,
        callbackURL: facebook.facebook_callback,
        profileFields: ['id', 'emails', 'picture.type(large)', 'name']
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserB2C.findOne({ email: profile.emails[0].value });
            if (!user) {
                // Create the user if it doesn't exist
                let name = "";
                if (profile.name && profile.name.givenName && profile.name.familyName) {
                    name = `${profile.name.givenName} ${profile.name.familyName}`;
                } else if (profile.displayName) {
                    name = profile.displayName;
                }
                user = new UserB2C({
                    email: profile.emails[0].value,
                    refreshToken: authHelpers.generateRefreshToken(),
                    roles: ['facebook', 'b2c'], // Assign a specific role for Facebook users
                    avatar: profile.photos[0].value, // Save the user's image URL
                    name: name
                });
                await user.save();
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
);


passport.use('jwt-b2c', jwtStrategyB2C);
passport.use('jwt-b2b', jwtStrategyB2B);
passport.use('jwt-admin', jwtStrategyAdmin);
passport.use('local-b2c', localStrategyB2C);
passport.use('local-b2b', localStrategyB2B);
passport.use('local-admin', localStrategyAdmin);
passport.use('google-b2c', googleTokenStrategyB2C);
passport.use('google-b2b', googleTokenStrategyB2B);
passport.use('facebook-b2c', facebookTokenStrategyB2C);


module.exports = passport;