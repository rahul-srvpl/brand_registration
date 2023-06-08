const productAwardSchema = {
    type: 'object',
    properties: {
        product_id: {
            type: 'string',
            required: true,
            format: 'uuid',
        },
        award_id: {
            type: 'string',
            required: true,
            format: 'uuid',
        },
        award_year: {
            type: 'number',
        },
        certificate_url: {
            type: 'string',
        },
        certificate_public_id: {
            type: 'string',
        },
    },
    timestamps: true,
};

module.exports = productAwardSchema;
