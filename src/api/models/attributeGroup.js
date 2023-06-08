const mongoose = require('mongoose');

const attributeGoupSchema = new mongoose.Schema({
    group_slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    group_name: { type: String, required: true, trim: true },
    group_desc: {type: String, trim: true},
    status: {
        type: String,
        enum: ['active', 'archived', 'draft'],
        default: 'active'
    }
}, { timestamps: true });

const AttributeGroup = mongoose.model('attribute_groups', attributeGoupSchema);
module.exports = AttributeGroup;