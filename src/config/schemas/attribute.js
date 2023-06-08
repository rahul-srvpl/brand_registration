const attributeSchema = {
    type: 'object',
    properties: {
        attribute_slug: {
            type: 'string',
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        attribute_name: {
            type: 'string',
            required: true,
            trim: true,
        },
        attribute_group_slug: {
            type: 'string',
            required: true,
            trim: true,
            lowercase: true,
        },
        attribute_group_name: {
            type: 'string',
            trim: true,
        },
        attribute_desc: {
            type: 'string',
            trim: true,
        },
        status: {
            type: 'string',
            enum: ['active', 'archived', 'draft'],
            default: 'active',
        },
        input_type: {
            type: 'string',
            default: 'text',
        },
        is_array: {
            type: 'boolean',
            default: false,
        },
    },
    timestamps: true,
};

module.exports = attributeSchema;