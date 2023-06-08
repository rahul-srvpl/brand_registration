const dotenv = require("dotenv");
const cloudinaryModule = require("cloudinary");
const { cloudinary_config } = require('../../config/vars');

const cloudinary = cloudinaryModule.v2;

cloudinary.config({
  cloud_name: cloudinary_config.cloudinary_name,
  api_key: cloudinary_config.cloudinary_api_key,
  api_secret: cloudinary_config.cloudinary_api_secret,
});

module.exports = cloudinary;