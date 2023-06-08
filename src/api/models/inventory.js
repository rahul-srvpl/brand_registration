const mongoose = require('mongoose');
mongoose.pluralize(null);

const getter = function (v) {
    if (typeof v !== 'undefined') {
        return parseFloat(v.toString());
    }
    return v;
};

const inventorySchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft', 'unlisted', 'supressed'],
        default: 'active'
    },
    product_id: {
        type: mongoose.Types.ObjectId, unique: true,
        ref: "products",
    },
    has_variations: { type: Boolean, default: false },
    variation_group_id: {
        type: mongoose.Types.ObjectId,
    },
    seller_id: {
        type: String, required: true,
        ref: "sellers",
    },
    qty_available: { type: Number, min: 0, default: 0 },
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
    business_price: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0,
        min: 0,
        get: getter
    },
    business_discount_type: {
        type: String,
        enum: ['percent', 'fixed', null],
        default: null
    },
    min_qty1: {
        type: Number, min: 0,
    },
    max_qty1: {
        type: Number, min: 0,
    },
    min_qty2: {
        type: Number, min: 0,
    },
    max_qty2: {
        type: Number, min: 0,
    },
    min_qty3: {
        type: Number, min: 0,
    },
    max_qty3: {
        type: Number, min: 0,
    },
    percent_off1: {
        type: Number, min: 0,
    },
    percent_off2: {
        type: Number, min: 0,
    },
    percent_off3: {
        type: Number, min: 0,
    },
    fixed_price1: {
        type: mongoose.Schema.Types.Decimal128,
        min: 0,
        get: getter
    },
    fixed_price2: {
        type: mongoose.Schema.Types.Decimal128,
        min: 0,
        get: getter
    },
    fixed_price3: {
        type: mongoose.Schema.Types.Decimal128,
        min: 0,
        get: getter
    }
}, { timestamps: true, toJSON: { getters: true } });


const Inventory = mongoose.model('inventory', inventorySchema);
module.exports = Inventory;