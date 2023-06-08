const mongoose = require('mongoose');
const Joi = require('joi');
const logger = require('../../../config/logger');
const userModel = require('../../models/user_b2b');
const cloudinary = require("../../utils/cloudinary");

const userValidationSchema = Joi.object({
  email: Joi.string(),
  isApproved: Joi.boolean(),
  isActivated: Joi.boolean(),
  lastLogin: Joi.date(),
  contact_business: Joi.string(),
  contact_personal: Joi.string(),
  avatar: Joi.string()
});

exports.edit = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const query = { _id: userId };
    const userInfo = req.body;
    delete userInfo._id;

    const { error } = userValidationSchema.validate(userInfo);
    if (error) {
      logger.info("Invalid request body", error);
      res.status(400).json({ "message": error.details[0].message });
      return;
    }

    // Upload avatar image if provided
    const updatePromises = [];
    if (userInfo.avatar) {
      // Delete previous avatar from cloudinary if it exists
      const user = await userModel.findById(userId);
      if (user.avatar_public_id) {
        await cloudinary.uploader.destroy(user.avatar_public_id);
      }

      const uploadedResponse = await cloudinary.uploader.upload(userInfo.avatar, {
        upload_preset: "21genx_avatars",
      });

      // Add the update promise for avatar field to the array
      updatePromises.push({
        field: "avatar",
        value: uploadedResponse.secure_url,
      });

      // Add the update promise for avatar_public_id field to the array
      updatePromises.push({
        field: "avatar_public_id",
        value: uploadedResponse.public_id,
      });
    }

    // Update the user document with the updated fields
    const updateFields = {};
    updatePromises.forEach((update) => {
      updateFields[update.field] = update.value;
    });

    const updatedUser = await userModel.findOneAndUpdate(query, updateFields, { new: true });
    if (!updatedUser) {
      logger.info("No records found");
      res.status(400).json({ "message": "No records found" });
      return;
    }

    updatedUser.refreshToken = undefined;
    updatedUser.resetTokenExpiration = undefined;

    res.json({ "success": true, "updated_user": updatedUser });
  } catch (err) {
    logger.error("Unable to update document", err);
    res.status(500).json({ "message": err });
  }
};
