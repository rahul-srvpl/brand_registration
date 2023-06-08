const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const attributeSchema = require('./schemas/attribute');
const attributeGroupSchema = require('./schemas/attributeGroup');
const awardSchema = require('./schemas/award');
const brandSchema = require('./schemas/brand');
const categorySchema = require('./schemas/category');
const categoryAttributeSchema = require('./schemas/categoryAttribute');
const countrySchema = require('./schemas/country');
const inventorySchema = require('./schemas/inventory');
const productSchema = require('./schemas/product');
const productImageSchema = require('./schemas/product_image');
const productAwardSchema = require('./schemas/productAward');
const variationSchema = require('./schemas/variation');
const variationDataSchema = require('./schemas/variationData');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: '21genx API',
      version: '1.0.0',
      description: 'APIs for 21genx MERN stack',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Replace with your server URL
      },
      {
        url: 'https://two1genx.onrender.com', // Replace with your server URL
      },
    ],
    baseApi: '/v1', // Replace with your base API path
    components: {
      schemas: {
        Attribute: attributeSchema,
        AttributeGroup: attributeGroupSchema,
        Award: awardSchema,
        Brand: brandSchema,
        Category: categorySchema,
        CategoryAttribute: categoryAttributeSchema,
        Country: countrySchema,
        Inventory: inventorySchema,
        Product: productSchema,
        ProductImage: productImageSchema,
        ProductAward: productAwardSchema,
        VariationData: variationDataSchema,
        Variation: variationSchema
      },
    },
  },
  apis: [
    './src/api/routes/v1/*.js', // Replace with the path to your actual route files
  ],
};

module.exports = swaggerOptions;
