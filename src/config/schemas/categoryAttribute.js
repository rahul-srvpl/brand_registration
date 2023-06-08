const categoryAttributeSchema = {
    type: 'object',
    properties: {
        attribute_id: {
            type: 'string',
            required: true,
        },
        category_id: {
            type: 'string',
            required: true,
        },
        required: {
            type: 'boolean',
            default: false,
        },
        recommended: {
            type: 'boolean',
            default: false,
        },
    },
    timestamps: true,
    indexes: [
        {
            fields: ['attribute_id', 'category_id'],
            unique: true,
        },
    ],
};

module.exports = categoryAttributeSchema;
