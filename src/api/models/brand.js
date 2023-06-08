const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
    seller_id: {
        type: String,
        required: true
    },
    brand_name: {
        type: String,
        required: true
    },
    brand_logo_url: {
        type: String,
        required: true
    },
    brand_logo_url_public_id: {
        type: String,
        required: true
    },
    brand_desc: {
        type: String,
        required: true
    }
}, { timestamps: true, toJSON: { getters: true }, strict: false });

const brand = mongoose.model('brands', brandSchema)

module.exports = brand;