const mongoose = require('mongoose');
mongoose.pluralize(null);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String },
  name: { type: String },
  refreshToken: { type: String, required: true },
  source: { type: String },
  roles: { type: [String], default: ['b2c'] },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
  lastLogin: { type: Date },
  phone: {
    number: { type: String },
    country_code: { type: String }
  },
  avatar: { type: String },
  avatar_public_id: { type: String }
});

module.exports = mongoose.model('users_b2c', userSchema);
