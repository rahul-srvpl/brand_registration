const mongoose = require('mongoose');
const User = require('../../models/user_b2b');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const { sendgrid, jwt_config, client_url } = require('../../../config/vars');
const authHelpers = require('../../utils/authHelpers');
const cloudinary = require('../../utils/cloudinary');
const fs = require('fs');

// Set SendGrid API key
sgMail.setApiKey(sendgrid.sendgrid_api_key);

exports.register = async (req, res) => {
    const { email, password, personal_name, business_name, contact_business, contact_personal } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Generate a hashed password
        const hashedPassword = await authHelpers.hashPassword(password);

        // Create a new user instance
        const user = new User({
            email,
            password: hashedPassword,
            personal_name,
            business_name,
            refreshToken: authHelpers.generateRefreshToken(),
            roles: ['b2b'],
            contact_business,
            contact_personal
        });

        // Upload PAN and GST files to Cloudinary
        const panFile = req.files['pan_upload'][0];
        const gstFile = req.files['gst_upload'][0];

        const panFilePath = panFile.path;
        const gstFilePath = gstFile.path;

        const panUploadResult = await cloudinary.uploader.upload(panFilePath, { upload_preset: '21genx_b2b_docs' });
        const gstUploadResult = await cloudinary.uploader.upload(gstFilePath, { upload_preset: '21genx_b2b_docs' });

        user.pan_upload = panUploadResult.secure_url;
        user.pan_upload_public_id = panUploadResult.public_id;
        user.gst_upload = gstUploadResult.secure_url;
        user.gst_upload_public_id = gstUploadResult.public_id;

        // Save the user to the database
        await user.save();

        // Generate activation token
        const token = jwt.sign(
            { email, password },
            jwt_config.jwt_secret,
            { expiresIn: '20m' }
        );

        // Send registration activation email
        const activationLink = `${client_url}/authentication/b2b/activate/${token}`;
        const mail = `
      <p>Hello ${personal_name}</p>
      <p>Thank you for registering!</p>
      <p>Your registration is being reviewed. Please verify your email by clicking on the following link:</p>
      <a href="${activationLink}">${activationLink}</a>
    `;

        const msg = {
            to: email,
            from: sendgrid.sendgrid_from_email,
            subject: 'Registration Confirmation',
            html: mail,
        };

        await sgMail.send(msg);

        // Remove uploaded files
        if (fs.existsSync(panFilePath)) {
            fs.unlinkSync(panFilePath);
        }
        if (fs.existsSync(gstFilePath)) {
            fs.unlinkSync(gstFilePath);
        }

        res.json({ message: 'User registered successfully', activation_link: activationLink });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};
