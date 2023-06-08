const mongoose = require("mongoose");

const AwardSchema = new mongoose.Schema({
  award_name: {
    type: String,
  },
  image: {
    type: String,
  },
  image_public_id: {
    type: String,
  },
  award_description: {
    type: String,
  },
  country: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'draft'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model("awards", AwardSchema);
