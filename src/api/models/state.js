const mongoose = require("mongoose");

const StateSchema = new mongoose.Schema({
  country_id: {
    type: mongoose.Types.ObjectId, 
    ref: 'countries'
  },
  state_name: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'draft'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model("states", StateSchema);
