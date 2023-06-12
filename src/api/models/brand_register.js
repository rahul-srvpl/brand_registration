const mongoose = require("mongoose");
const brad_register_Schema = new mongoose.Schema(
  {
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    brand_name: {
      type: String,
      required: true,
    },
    brand_logo: {
      url: { type: String },
      public_id: { type: String },
    },
    brand_description: {
      type: String,
      required: true,
    },
    trademark_office: {
      type: String,
      required: true,
    },
    trademark_reg_no: {
      type: String,
      required: true,
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
    product_images: {
      url: { type: String },
      public_id: { type: String },
    },
    is_seller: {
      type: Boolean,
      default: false,
    },
    is_selling_acount: {
      type: String,
      default: "NA",
    },
    is_vendor: {
      type: Boolean,
      default: false,
    },
    vendor_code: {
      type: String,
    },
    is_neither: {
      type: Boolean,
      default: false,
    },
    product_category_id: [
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
    product_distributed_to_country_id: {
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

module.exports = mongoose.model("brands", brad_register_Schema);
