const mongoose = require('mongoose');

const variationSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Types.ObjectId, required: true,
        ref: "products"
    },
    variation_group_id: {
        type: mongoose.Types.ObjectId, required: true,
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
    }
}, { timestamps: true });

const Variation = mongoose.model('product_variations', variationSchema);
module.exports = Variation;