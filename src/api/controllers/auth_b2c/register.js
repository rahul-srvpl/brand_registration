const mongoose = require('mongoose');
const User = require('../../models/user_b2c');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const { sendgrid, jwt_config, client_url } = require('../../../config/vars');

// Set SendGrid API key
sgMail.setApiKey(sendgrid.sendgrid_api_key);

exports.register = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Generate activation token
        const token = jwt.sign(
            { email, password, name },
            jwt_config.jwt_secret,
            { expiresIn: '20m' }
        );

        // Send registration activation email
        const activationLink = `${client_url}/authentication/b2c/activate/${token}`;
        const mail = `
        <p>Hello ${name}</p>
        <p>Thank you for registering on 21genx!</p>
        <p>Please click on the following link to activate your account:</p>
        <a href="${activationLink}">${activationLink}</a>
        <p>If you didn't register on our platform, please ignore this email.</p>
      `;

        const msg = {
            to: email,
            from: sendgrid.sendgrid_from_email,
            subject: 'Welcome to 21genx',
            html: mail,
        };

        await sgMail.send(msg);

        res.json({ email, activationLink });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};