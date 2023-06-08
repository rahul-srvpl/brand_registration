const awardSchema = {
    type: 'object',
    properties: {
        award_name: {
            type: 'string',
        },
        image: {
            type: 'string',
        },
        image_public_id: {
            type: 'string',
        },
        award_description: {
            type: 'string',
        },
        country: {
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

module.exports = awardSchema;
