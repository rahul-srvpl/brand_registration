const mongoose = require("mongoose");
const categories = require("./category");

const couponSchema = new mongoose.Schema(
  {
    coupon_code: {
      type: String,
      required: true,
    },
    category_type: {
      type: String,
      enum: ["parent", "sub", "child", "whole webside"],
    },
    category: { type: String },
    description: { type: String },
    discount_type: {
      type: String,
      enum: ["percentage", "amount"],
    },
    discount: {
      type: String,
    },
    quantity_type: {
      type: String,
      enum: ["limited", "unlimited"],
    },
    quantity: {
      type: Number,
    },
    start_date: {
      type: String,
    },
    end_date: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("coupons", couponSchema);
