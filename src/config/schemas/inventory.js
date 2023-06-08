const inventorySchema = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            enum: ['active', 'inactive', 'draft', 'unlisted', 'supressed'],
            default: 'active',
        },
        product_id: {
            type: 'string',
            unique: true,
            format: 'uuid',
        },
        parent_product_id: {
            type: 'string',
            format: 'uuid',
        },
        parent_child: {
            type: 'string',
            enum: ['parent', 'child'],
            default: 'parent',
        },
        seller_id: {
            type: 'string',
            required: true,
            format: 'uuid',
        },
        qty_available: {
            type: 'number',
            minimum: 0,
            default: 0,
        },
        list_price: {
            type: 'number',
            minimum: 0,
            default: 0,
        },
        max_retail_price: {
            type: 'number',
            minimum: 0,
            default: 0,
        },
        business_price: {
            type: 'number',
            minimum: 0,
            default: 0,
        },
        business_discount_type: {
            type: 'string',
            enum: ['percent', 'fixed', null],
            default: null,
        },
        min_qty1: {
            type: 'number',
            minimum: 0,
        },
        max_qty1: {
            type: 'number',
            minimum: 0,
        },
        min_qty2: {
            type: 'number',
            minimum: 0,
        },
        max_qty2: {
            type: 'number',
            minimum: 0,
        },
        min_qty3: {
            type: 'number',
            minimum: 0,
        },
        max_qty3: {
            type: 'number',
            minimum: 0,
        },
        percent_off1: {
            type: 'number',
            minimum: 0,
        },
        percent_off2: {
            type: 'number',
            minimum: 0,
        },
        percent_off3: {
            type: 'number',
            minimum: 0,
        },
        fixed_price1: {
            type: 'number',
            minimum: 0,
        },
        fixed_price2: {
            type: 'number',
            minimum: 0,
        },
        fixed_price3: {
            type: 'number',
            minimum: 0,
        },
    },
    timestamps: true,
    toJSON: {
        getters: true,
    },
};

module.exports = inventorySchema;
