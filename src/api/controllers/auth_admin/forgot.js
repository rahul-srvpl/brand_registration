const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../../models/admin');
const sgMail = require('@sendgrid/mail');
const { sendgrid } = require('../../../config/vars');

// Set SendGrid API key
sgMail.setApiKey(sendgrid.sendgrid_api_key);

exports.forgot = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user logged in using Google or Facebook strategy
        if (user.roles.includes('google') || user.roles.includes('facebook')) {
            return res.status(403).json({ error: 'Password reset is not allowed for social login users' });
        }

        // Generate a unique password reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour

        // Save the user with the reset token
        await user.save();

        // Send password reset email
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
        const msg = {
            to: email,
            from: sendgrid.sendgrid_from_email, // Replace with your email
            subject: 'Password Reset',
            text: `Click the following link to reset your password: ${resetUrl}`,
            html: `<p>Click the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
        };

        try {
            await sgMail.send(msg);
        } catch (error) {
            console.error('Error sending password reset email:', error);
        }

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error initiating password reset:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};