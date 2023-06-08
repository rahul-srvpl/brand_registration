const mongoose = require('mongoose');
mongoose.pluralize(null);

const getter = function (v) {
    if (typeof v !== 'undefined') {
        return parseFloat(v.toString());
    }
    return v;
};

const productSchema = new mongoose.Schema({
    product_sku: { type: String, unique: true, required: true },
    product_external_id: { type: String, unique: true, required: true },
    product_external_id_type: { type: String, required: true },
    item_name: { type: String, required: true },
    brand_id: { type: mongoose.Types.ObjectId, ref: 'brands' },
    has_brand: { type: Boolean, default: true },
    child_category_id: { type: mongoose.Types.ObjectId, ref: 'categories' },
    sub_category_id: { type: mongoose.Types.ObjectId, ref: 'categories' },
    parent_category_id: { type: mongoose.Types.ObjectId, ref: 'categories' },
    seller_id: { type: mongoose.Types.ObjectId, ref: 'sellers' },
    country_id: { type: mongoose.Types.ObjectId, ref: 'countries' },
    awards: [{ type: mongoose.Types.ObjectId, ref: 'awards' }],
    has_variations: { type: Boolean, default: false },
    item_condition: {
        type: String,
        enum: ['new', 'old'],
        default: 'new'
    },
    condition_note: { type: String },
    sgst: { type: Number, min: 0 },
    cgst: { type: Number, min: 0 },
    status: {
        type: String,
        enum: ['active', 'draft', 'inactive'],
        default: 'active'
    },
    condition: {
        type: String,
        enum: ['new', 'refurbished'],
        default: 'new'
    },
    variation_name1: {
        type: String
    },
    variation_value1: {
        type: String
    },
    variation_name2: {
        type: String
    },
    variation_value2: {
        type: String
    },
    variation_group_id: {
        type: mongoose.Types.ObjectId,
    },
    list_price: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
        min: 0,
        get: getter
    },
    max_retail_price: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
        min: 0,
        get: getter
    },
    approval_status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    },
    review_status: {
        type: String,
        enum: ['pending', 'reviewed'],
        default: 'pending'
    }
}, { timestamps: true, toJSON: { getters: true }, strict: false });

const ProductModel = mongoose.model('products', productSchema);
module.exports = ProductModel;
