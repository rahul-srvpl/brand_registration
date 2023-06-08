//const { EMAIL_PROVIDER, ROLES } = require('../../constants');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const sellerAuthSchema = new Schema({
    fullname: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,
    },
    store_name: {
        type: String,
        required: true,
    },
    mobile: {
        type: String
    },
    // role: {
    //     type: String,
    //     default: ROLES.SELLER,
    //     enum: [ROLES.SELLER]
    // },
    sellerType: {
        type: String,
        default: "establishBusiness",
        enum: ["establishBusiness", "startUp"],
        required: true,
    },
    gst_number: {
        type: String,
        required: true,
    },
    pan_number: {
        type: String,
        required: true,
    },

    isVerify: {
        type: Boolean,
        default : false
    },
    gstImageUrl : {
        type : String,
    },
    panImageUrl : {
        type : String,
    },
    resetPasswordToken: 
    { type: String },
    resetPasswordExpires: 
    { type: Date },
    marketplace : {
        type :String
    },
    storeDtl : {
        type : String
    },
    replayToEmail : {
        type :String
    }

}, { timestamps : true}
);

module.exports = mongoose.model('sellers', sellerAuthSchema);