const mongoose = require("mongoose");

const brad_register_Schema = new mongoose.Schema(
  {
    brand_name: {
      type: String,
    },
    trademark_office: {
      type: String,
    },
    trademark_reg_no: {
      type: String,
    },
    trademark_status: {
      type: String,
      enum: ["registered", "pending"],
      message: "trademark_status must have value of 'registered' or 'pending'",
    },
    trademark_type: {
      type: String,
      enum: ["word mark", "device mark"],
      message: "trademark_type must have value of 'word mark' or 'device mark'",
    },
    images: {
      type: Object,
      required: true,
    },
    seller: {
      type: Boolean,
      default: false,
    },
    vendor: {
      type: Boolean,
      default: false,
    },
    neither: {
      type: Boolean,
      default: false,
    },
    product_category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],
    ASINs_no: [
      {
        type: String,
      },
    ],
    url_brands_official_website: [
      {
        type: String,
      },
    ],
    sell_to_distributors: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    distributors_sell_on_amazone: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    product_distributed_to_country: {
      type: mongoose.Schema.Types.ObjectId,
    },
    license_information: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    is_license_sell_on_amazon: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("brand_registers", brad_register_Schema);
