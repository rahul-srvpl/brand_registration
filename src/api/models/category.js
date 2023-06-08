const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    status: {
        type: String,
        enum: ['active', 'archived', 'draft'],
        default: 'active',
        required: function () {
            return this.category_type === "child"
        },
    },
    category_name: { type: String, required: true, trim: true },
    category_desc: { type: String, required: true },
    category_type: {
        type: String,
        enum: {
            values: ['parent', 'sub', 'child'],
            message: "category_type must have value of 'parent', 'sub' or 'child'",
        },
        required: true,
    },
    parent_category_id: {
        type: mongoose.Types.ObjectId,
        ref: "categories",
        required: function () {
            return this.category_type === "sub" || this.category_type === "child"
        }
    },
    sub_category_id: {
        type: mongoose.Types.ObjectId,
        ref: "categories",
        required: function () {
            return this.category_type === "child"
        }
    }
}, { timestamps: true });

const Category = mongoose.model('categories', categorySchema);
module.exports = Category;