const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
    attribute_slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    attribute_name: { type: String, required: true, trim: true },
    attribute_group_slug: { type: String, required: true, trim: true, lowercase: true },
    attribute_group_name: { type: String, trim: true },
    attribute_desc: { type: String, trim: true },
    status: {
        type: String,
        enum: ['active', 'archived', 'draft'],
        default: 'active'
    },
    input_type: { type: String, default: "text" },
    is_array: {type: Boolean, default: false}
}, { timestamps: true });

const Attribute = mongoose.model('attributes', attributeSchema);
module.exports = Attribute;