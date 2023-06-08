const mongoose = require('mongoose');

const categoryAttributeSchema = new mongoose.Schema({
    attribute_id: {
        type: mongoose.Types.ObjectId, required: true,
        ref: "attributes"
    },
    category_id: {
        type: mongoose.Types.ObjectId, required: true,
        ref: "categories"
    },
    required: { type: Boolean, default: false },
    recommended: { type: Boolean, default: false }
}, { timestamps: true });

categoryAttributeSchema.index({ attribute_id: 1, category_id: 1 }, { unique: true });

const CategoryAttribute = mongoose.model('category_attributes', categoryAttributeSchema);
module.exports = CategoryAttribute;