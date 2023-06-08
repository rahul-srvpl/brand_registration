const mongoose = require('mongoose');
const authHelpers = require('../../utils/authHelpers');
const sgMail = require('@sendgrid/mail');
const { sendgrid } = require('../../../config/vars');

// Set SendGrid API key
sgMail.setApiKey(sendgrid.sendgrid_api_key);

exports.change = async (req, res) => {
    const user = req.user;

    const { currentPassword, newPassword } = req.body;

    try {
        // Verify the current password
        const passwordMatch = await authHelpers.comparePasswords(
            currentPassword,
            user.password
        );
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

        // Hash the new password
        const hashedPassword = await authHelpers.hashPassword(newPassword);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        // Send password changed email
        const message = {
            to: user.email,
            from: sendgrid.sendgrid_from_email,
            subject: 'Password Changed',
            text: 'Your password has been successfully changed.',
            html: '<p>Your password has been successfully changed.</p>'
        };

        await sgMail.send(message);

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
