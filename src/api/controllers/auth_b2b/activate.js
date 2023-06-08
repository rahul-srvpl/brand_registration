const mongoose = require('mongoose');
const User = require('../../models/user_b2b');
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

                const { email } = decodedToken;

                // Find the user by email
                const user = await User.findOne({ email });
                if (!user) {
                    return res.status(400).json({ msg: 'User not found' });
                }

                // Update the user's isActivated field to true
                user.isActivated = true;
                await user.save();

                // Send activation email
                const mail = `
                    <p>Hello ${user.personal_name}</p>
                    <p>Your account has been activated, Please login</p>
                `;

                const message = {
                    to: email,
                    from: sendgrid.sendgrid_from_email,
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
