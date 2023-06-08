const mongoose = require('mongoose');

const productAwardSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Types.ObjectId, required: true,
        ref: "products"
    },
    award_id: {
        type: mongoose.Types.ObjectId, required: true,
        ref: "awards"
    },
    award_year: { type: Number },
    certificate_url: { type: String },
    certificate_public_id: { type: String }
}, { timestamps: true });

productAwardSchema.index({ product_id: 1, award_id: 1 }, { unique: true });

const ProductAward = mongoose.model('product_awards', productAwardSchema);
module.exports = ProductAward;