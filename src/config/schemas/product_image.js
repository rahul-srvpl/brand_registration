const productImageSchema = {
    type: 'object',
    properties: {
        product_id: {
            type: 'string',
            required: true,
            format: 'uuid',
            unique: true,
        },
        main_img: {
            type: 'string',
        },
        img_2: {
            type: 'string',
        },
        img_3: {
            type: 'string',
        },
        img_4: {
            type: 'string',
        },
        img_5: {
            type: 'string',
        },
        img_6: {
            type: 'string',
        },
        img_7: {
            type: 'string',
        },
        img_8: {
            type: 'string',
        },
        main_img_public_id: {
            type: 'string',
        },
        img_2_public_id: {
            type: 'string',
        },
        img_3_public_id: {
            type: 'string',
        },
        img_4_public_id: {
            type: 'string',
        },
        img_5_public_id: {
            type: 'string',
        },
        img_6_public_id: {
            type: 'string',
        },
        img_7_public_id: {
            type: 'string',
        },
        img_8_public_id: {
            type: 'string',
        },
    },
    timestamps: true,
    toJSON: {
        getters: true,
    },
};

module.exports = productImageSchema;
