const mongoose = require('mongoose');
mongoose.pluralize(null);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String },
  personal_name: { type: String },
  business_name: { type: String },
  refreshToken: { type: String, required: true },
  source: { type: String },
  roles: { type: [String], default: ['b2b'] },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
  isApproved: { type: Boolean, default: false },
  isActivated: { type: Boolean, default: false },
  lastLogin: { type: Date },
  contact_business: { type: String },
  contact_personal: { type: String },
  avatar: { type: String },
  avatar_public_id: { type: String },
  pan_upload: { type: String },
  pan_upload_public_id: { type: String },
  gst_upload: { type: String },
  gst_upload_public_id: { type: String }
});

module.exports = mongoose.model('users_b2b', userSchema);
