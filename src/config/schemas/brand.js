const brandSchema = {
    type: 'object',
    properties: {
        seller_id: {
            type: 'string',
            required: true,
        },
        brand_name: {
            type: 'string',
            required: true,
        },
        brand_logo_url: {
            type: 'string',
            required: true,
        },
        brand_logo_url_public_id: {
            type: 'string',
            required: true,
        },
        brand_desc: {
            type: 'string',
            required: true,
        },
    },
    timestamps: true,
    toJSON: {
        getters: true,
    },
    strict: false,
};

module.exports = brandSchema;
