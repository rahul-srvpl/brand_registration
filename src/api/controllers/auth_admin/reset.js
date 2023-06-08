const mongoose = require('mongoose');
const User = require('../../models/admin');
const sgMail = require('@sendgrid/mail');
const authHelpers = require('../../utils/authHelpers');
const { sendgrid } = require('../../../config/vars');

// Set SendGrid API key
sgMail.setApiKey(sendgrid.sendgrid_api_key);

exports.reset = async (req, res) => {
    const { token, password } = req.body;

    try {
        // Find the user with the matching reset token and a valid resetTokenExpiration
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Reset the user's password
        user.password = await authHelpers.hashPassword(password);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        // Save the updated user
        await user.save();

        // Send password reset successful email
        const message = {
            to: user.email,
            from: sendgrid.sendgrid_from_email,
            subject: 'Password Reset Successful',
            text: 'Your password has been successfully reset.',
        };

        await sgMail.send(message);

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
