const productSchema = {
    type: 'object',
    properties: {
        product_sku: {
            type: 'string',
            unique: true,
            required: true,
        },
        product_external_id: {
            type: 'string',
            unique: true,
            required: true,
        },
        product_external_id_type: {
            type: 'string',
            required: true,
        },
        item_name: {
            type: 'string',
            required: true,
        },
        brand_id: {
            type: 'string',
            format: 'uuid',
        },
        has_brand: {
            type: 'boolean',
            default: true,
        },
        child_category_id: {
            type: 'string',
            format: 'uuid',
        },
        sub_category_id: {
            type: 'string',
            format: 'uuid',
        },
        parent_category_id: {
            type: 'string',
            format: 'uuid',
        },
        seller_id: {
            type: 'string',
            format: 'uuid',
        },
        country_id: {
            type: 'string',
            format: 'uuid',
        },
        awards: {
            type: 'array',
            items: {
                type: 'string',
                format: 'uuid',
            },
        },
        has_variations: {
            type: 'boolean',
            default: false,
        },
        item_condition: {
            type: 'string',
            enum: ['new', 'old'],
            default: 'new',
        },
        condition_note: {
            type: 'string',
        },
        sgst: {
            type: 'number',
            minimum: 0,
        },
        cgst: {
            type: 'number',
            minimum: 0,
        },
        status: {
            type: 'string',
            enum: ['active', 'draft', 'inactive'],
            default: 'active',
        },
        condition: {
            type: 'string',
            enum: ['new', 'refurbished'],
            default: 'new',
        },
        variation_name1: {
            type: 'string',
        },
        variation_value1: {
            type: 'string',
        },
        variation_name2: {
            type: 'string',
        },
        variation_value2: {
            type: 'string',
        },
        list_price: {
            type: 'number',
            minimum: 0,
        },
        max_retail_price: {
            type: 'number',
            minimum: 0,
        },
        approval_status: {
            type: 'string',
            enum: ['pending', 'approved', 'declined'],
            default: 'pending',
        },
        review_status: {
            type: 'string',
            enum: ['pending', 'reviewed'],
            default: 'pending',
        },
    },
    timestamps: true,
    toJSON: {
        getters: true,
    },
};

module.exports = productSchema;
