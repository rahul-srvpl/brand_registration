const Joi = require('joi');
const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const productAwardModel = require('../../models/productAward');
const cloudinary = require('../../utils/cloudinary');
const fs = require('fs');

exports.uploadCert = async (req, res, next) => {
  try {
    const certFile = req.files['award_cert'][0];
    const certFilePath = certFile.path;
    const certUploadResult = await cloudinary.uploader.upload(certFilePath, { upload_preset: '21genx_award_cert' });

    // Remove uploaded file
    if (fs.existsSync(certFilePath)) {
      fs.unlinkSync(certFilePath);
    }

    res.send({ "success": true, "cert_secure_url": certUploadResult.secure_url, "cert_public_id": certUploadResult.public_id });
  } catch (err) {
    const errorMessage = `Unable to upload certificate: ${err.message}`;
    logger.error(errorMessage);
    res.status(500).send({ "message": "Unable to upload certificate", "error": err.message });
  }
};
