const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  country_name: {
    type: String,
  },
  image: {
    type: String,
  },
  image_public_id: { type: String },
  status: {
    type: String,
    enum: ['active', 'archived', 'draft'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model("countries", countrySchema);
