const mongoose = require("mongoose");
const product = require("./product");

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
    orderStatus: {
      type: String,
      enum: ["pending", "delivered", "cancelled", "shipped"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      requird: true,
    },
    totatlProduct: { type: Number },
    amount: { type: String, required: true },
    orderItems: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    shipingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_addresses",
    },
    billingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_addresses",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    payment: {
      type: String,
      enum: ["unpaid", "paid"],
    },
    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coupons",
      default: "NA",
    },
    sellerDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
    },
    isCancle: {
      type: String,
      default: false,
    },
    isReturn: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order_tables", orderSchema);
