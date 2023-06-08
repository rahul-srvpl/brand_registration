const attributeGroupSchema = {
    type: 'object',
    properties: {
        group_slug: {
            type: 'string',
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        group_name: {
            type: 'string',
            required: true,
            trim: true,
        },
        group_desc: {
            type: 'string',
            trim: true,
        },
        status: {
            type: 'string',
            enum: ['active', 'archived', 'draft'],
            default: 'active',
        },
    },
    timestamps: true,
};

module.exports = attributeGroupSchema;