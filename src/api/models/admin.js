const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String },
  refreshToken: { type: String, required: true },
  source: { type: String },
  roles: { type: [String], default: ['admin'] },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
  lastLogin: { type: Date }
});

module.exports = mongoose.model('admins', userSchema);
