const variationDataSchema = {
    type: 'object',
    properties: {
        product_sku: {
            type: 'string',
            required: true,
        },
        product_external_id: {
            type: 'string',
            required: true,
        },
        product_external_id_type: {
            type: 'string',
            required: true,
            enum: ['ASIN'],
        },
        item_condition: {
            type: 'string',
            required: true,
            enum: ['new'],
        },
        list_price: {
            type: 'number',
            required: true,
        },
        max_retail_price: {
            type: 'number',
            required: true,
        },
        qty: {
            type: 'number',
            required: true,
        },
        variation_name1: {
            type: 'string',
            required: true,
        },
        variation_value1: {
            type: 'string',
            required: true,
        },
        variation_name2: {
            type: 'string',
            required: true,
        },
        variation_value2: {
            type: 'string',
            required: true,
        },
        offer_start_date_offer: {
            type: 'string',
            format: 'date-time',
        },
        offer_end_date_offer: {
            type: 'string',
            format: 'date-time',
        },
    },
};

module.exports = variationDataSchema;