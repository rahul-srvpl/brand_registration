const joi = require("joi");

const createSchema = joi.object({
    seller_id: joi.string().min(3).required(),
    brand_name: joi.string().min(2).required(),
    image: joi.string().required(),
    brand_desc: joi.string().min(10).required(),
});

const updateSchema = joi.object({
    _id: joi.string().required(),
    image: joi.string(),
    brand_desc: joi.string()
})

module.exports = { createSchema, updateSchema } 