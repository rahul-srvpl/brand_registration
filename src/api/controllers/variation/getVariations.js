const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const variationModel = require('../../models/variation');
const mquery = require('express-mquery');

exports.getVariations = async (req, res, next) => {
    try {
        const { filter = {}, paginate, sort = { createdAt: -1 }, select } = req.mquery;

        if (filter._id) {
            filter._id.$eq = new mongoose.Types.ObjectId(filter._id.$eq);
        }
        if (filter.variation_group_id) {
            filter.variation_group_id.$eq = new mongoose.Types.ObjectId(filter.variation_group_id.$eq);
        }

        const pipeline = [
            { '$match': filter },
            {
                '$lookup': {
                    'from': 'products',
                    'let': { 'productId': '$product_id' },
                    'pipeline': [
                        { '$match': { '$expr': { '$eq': ['$_id', '$$productId'] } } },
                        { '$project': { 'item_name': 1 } }
                    ],
                    'as': 'product'
                }
            },
            {
                '$lookup': {
                    'from': 'product_images',
                    'let': { 'productId': '$product_id' },
                    'pipeline': [
                        { '$match': { '$expr': { '$eq': ['$product_id', '$$productId'] } } },
                        { '$project': { 'main_img': 1 } }
                    ],
                    'as': 'product_image'
                }
            },
            {
                '$lookup': {
                    'from': 'inventory',
                    'let': { 'productId': '$product_id' },
                    'pipeline': [
                        { '$match': { '$expr': { '$eq': ['$product_id', '$$productId'] } } },
                        {
                            '$project': {
                                'qty_available': 1,
                                'list_price': { '$toDouble': '$list_price' },
                                'max_retail_price': { '$toDouble': '$max_retail_price' },
                                'business_price': { '$toDouble': '$business_price' },
                                'business_discount_type': 1,
                                'min_qty1': 1,
                                'max_qty1': 1,
                                'min_qty2': 1,
                                'max_qty2': 1,
                                'min_qty3': 1,
                                'max_qty3': 1,
                                'percent_off1': 1,
                                'percent_off2': 1,
                                'percent_off3': 1,
                                'fixed_price1': 1,
                                'fixed_price2': 1,
                                'fixed_price3': 1
                            }
                        },
                        {
                            '$addFields': {
                                'inventory.list_price': { '$toDouble': '$list_price' },
                                'inventory.max_retail_price': { '$toDouble': '$max_retail_price' },
                                'inventory.discount_percent': {
                                    '$toDouble': {
                                        '$round': [
                                            {
                                                '$cond': {
                                                    'if': { '$ne': ['$max_retail_price', 0] },
                                                    'then': {
                                                        '$multiply': [
                                                            { '$divide': [{ '$subtract': ['$max_retail_price', '$list_price'] }, '$max_retail_price'] },
                                                            100
                                                        ]
                                                    },
                                                    'else': 0
                                                }
                                            },
                                            1
                                        ]
                                    }
                                },
                                'inventory.price_1': {
                                    '$cond': [
                                        { '$eq': ['$business_discount_type', 'fixed'] },
                                        { '$toDouble': '$fixed_price1' },
                                        {
                                            '$cond': [
                                                {
                                                    '$and': [
                                                        { '$eq': ['$business_discount_type', 'percent'] },
                                                        { '$ne': ['$percent_off1', null] }
                                                    ]
                                                },
                                                {
                                                    '$round': [
                                                        { '$multiply': ['$business_price', { '$subtract': [1, { '$divide': ['$percent_off1', 100] }] }] },
                                                        2
                                                    ]
                                                },
                                                null
                                            ]
                                        }
                                    ]
                                },
                                'inventory.price_2': {
                                    '$cond': [
                                        { '$eq': ['$business_discount_type', 'fixed'] },
                                        { '$toDouble': '$fixed_price2' },
                                        {
                                            '$cond': [
                                                {
                                                    '$and': [
                                                        { '$eq': ['$business_discount_type', 'percent'] },
                                                        { '$ne': ['$percent_off2', null] }
                                                    ]
                                                },
                                                {
                                                    '$round': [
                                                        { '$multiply': ['$business_price', { '$subtract': [1, { '$divide': ['$percent_off2', 100] }] }] },
                                                        2
                                                    ]
                                                },
                                                null
                                            ]
                                        }
                                    ]
                                },
                                'inventory.price_3': {
                                    '$cond': [
                                        { '$eq': ['$business_discount_type', 'fixed'] },
                                        { '$toDouble': '$fixed_price3' },
                                        {
                                            '$cond': [
                                                {
                                                    '$and': [
                                                        { '$eq': ['$business_discount_type', 'percent'] },
                                                        { '$ne': ['$percent_off3', null] }
                                                    ]
                                                },
                                                {
                                                    '$round': [
                                                        { '$multiply': ['$business_price', { '$subtract': [1, { '$divide': ['$percent_off3', 100] }] }] },
                                                        2
                                                    ]
                                                },
                                                null
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            '$project': {
                                'qty_available': 1,
                                'business_price': 1,
                                'business_discount_type': 1,
                                'min_qty1': 1,
                                'max_qty1': 1,
                                'min_qty2': 1,
                                'max_qty2': 1,
                                'min_qty3': 1,
                                'max_qty3': 1,
                                'price_1': { '$ifNull': ['$inventory.price_1', '$fixed_price1'] },
                                'price_2': { '$ifNull': ['$inventory.price_2', '$fixed_price2'] },
                                'price_3': { '$ifNull': ['$inventory.price_3', '$fixed_price3'] },
                                'list_price': 1,
                                'max_retail_price': 1,
                                'discount_percent': 1
                            }
                        }
                    ],
                    'as': 'inventory'
                }
            }
        ];

        if (select) {
            pipeline.push({ '$project': select });
        }

        const variationList = await variationModel.aggregate(pipeline)
            .sort(sort)
            .skip(paginate.skip)
            .limit(paginate.limit);

        const count = variationList.length;

        res.send({
            from: paginate.skip + 1,
            to: paginate.skip,
            count: count,
            data: variationList,
        });
    } catch (err) {
        logger.error(err.message);
        console.log(err.message);
        next(err);
    }
};
