const mongoose = require('mongoose');
const User = require('../../models/user_b2c');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const authHelpers = require('../../utils/authHelpers');
const { sendgrid, jwt_config } = require('../../../config/vars');

// Set SendGrid API key
sgMail.setApiKey(sendgrid.sendgrid_api_key);


exports.activate = async (req, res) => {
    try {
        const { token } = req.body;
        if (token) {
            jwt.verify(token, jwt_config.jwt_secret, async (err, decodedToken) => {
                if (err) {
                    return res.status(400).json({ error: 'Incorrect or expired link' });
                }

                const { email, password, name } = decodedToken;

                // Check if an account with the same email already exists
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ msg: 'An account with this email already exists' });
                }

                // Generate a hashed password
                const hashedPassword = await authHelpers.hashPassword(password);

                // Create the user
                const user = new User({
                    email,
                    password: hashedPassword,
                    name,
                    refreshToken: authHelpers.generateRefreshToken(),
                    roles: ['b2c'], // Assign default role ['b2c'] for activation
                });
                await user.save();

                // Send activation email
                const mail = `
                    <p>Hello ${name},</p>
                    <p>Your account has been activated, please login!</p>
                `;

                const message = {
                    to: email,
                    from: sendgrid.sendgrid_from_email, // Replace with your email
                    subject: 'Account Activated',
                    html: mail
                };

                await sgMail.send(message);

                res.status(200).json({ message: 'Account activated successfully, please login' });
            });
        } else {
            return res.status(400).json({ error: 'Error in verifying account. Please try again' });
        }
    } catch (error) {
        console.error('Error activating account:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};