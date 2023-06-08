const categorySchema = {
    type: 'object',
    properties: {
        category_slug: {
            type: 'string',
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        status: {
            type: 'string',
            enum: ['active', 'archived', 'draft'],
            default: 'active',
            required: true,
        },
        category_name: {
            type: 'string',
            required: true,
            trim: true,
        },
        category_desc: {
            type: 'string',
            required: true,
        },
        category_type: {
            type: 'string',
            enum: ['parent', 'sub', 'child'],
            required: true,
        },
        parent_category_id: {
            type: 'string',
            required: true,
        },
        sub_category_id: {
            type: 'string',
            required: true,
        },
    },
    timestamps: true,
};

module.exports = categorySchema;
