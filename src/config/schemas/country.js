const countrySchema = {
    type: 'object',
    properties: {
        country_name: {
            type: 'string',
        },
        image: {
            type: 'string',
        },
        image_public_id: {
            type: 'string',
        },
        status: {
            type: 'string',
            enum: ['active', 'archived', 'draft'],
            default: 'active',
        },
    },
    timestamps: true,
};

module.exports = countrySchema;
