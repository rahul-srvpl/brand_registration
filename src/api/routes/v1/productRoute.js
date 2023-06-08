const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');

const { add } = require('../../controllers/product/add');
const { get } = require('../../controllers/product/get');
const { getById } = require('../../controllers/product/getById');
const { removeById } = require('../../controllers/product/removeById');
const { edit } = require('../../controllers/product/edit');
const { addVariations } = require('../../controllers/product/addVariations');
const { getProductsListName } = require('../../controllers/product/getProductsList-name');
const { getProductsListId } = require('../../controllers/product/getProductsList-Id');
const { getAllProductPageB2C } = require('../../controllers/product/getAllProductPageB2C');
const { getProductPageB2C } = require('../../controllers/product/getProductPageB2C');
const { getAllProductPageB2B } = require('../../controllers/product/getAllProductPageB2B');
const { getProductPageB2B } = require('../../controllers/product/getProductPageB2B');

const router = express.Router();

// Import the Swagger options from config/swagger.js
const swaggerOptions = require('../../../config/swagger');

const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * @swagger
 * basePath: /v1
 * tags:
 *   name: Product
 *   description: API endpoints for managing product
 */

/**
 * @swagger
 * /v1/products/add:
 *   post:
 *     summary: Add a product
 *     tags:
 *       - Product
 *     description: Add a new product along with its details and awards.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 added_product:
 *                   $ref: '#/components/schemas/Product'
 *                 added_inventory:
 *                   $ref: '#/components/schemas/Inventory'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/add", add);

/**
 * @swagger
 * /v1/products/add-variation:
 *   post:
 *     summary: Add variations to a product
 *     tags:
 *       - Product
 *     description: Add variations to an existing product.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parent_id:
 *                 type: string
 *               variation_data:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/VariationData'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 added_products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 added_inventory:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inventory'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/add-variation", addVariations);

/**
 * @swagger
 * /v1/products/get:
 *   get:
 *     summary: Get products
 *     tags:
 *       - Product
 *     description: Retrieve a list of products based on filters, pagination, and sorting.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page.
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to include in the response.
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Filter conditions in the format of key-value pairs.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting criteria in the format of key-value pairs.
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: Comma-separated list of related entities to populate.
 *     responses:
 *       '200':
 *         description: Successful response with the list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: integer
 *                 size:
 *                   type: integer
 *                 count:
 *                   type: integer
 *                 productList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: unable to get product
 */
router.get("/get", get);

/**
 * @swagger
 * /v1/products/get/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags:
 *       - Product
 *     description: Retrieve a product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *         required: true
 *         description: ID of the product to retrieve.
 *     responses:
 *       '200':
 *         description: Successful response with the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Failed to get product by ID
 */
router.get("/get/:id", getById);

/**
 * @swagger
 * /v1/products/get-products-list/name:
 *   get:
 *     summary: Get list of products with additional information
 *     tags:
 *       - Product
 *     description: Retrieve a list of products with additional information such as images, categories, awards, country, and seller.
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number for pagination.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         description: Number of items per page.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: fields
 *         description: Comma-separated list of fields to include in the response.
 *         schema:
 *           type: string
 *       - in: query
 *         name: query
 *         description: Filter conditions in the format of key-value pairs.
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         description: Sorting criteria in the format of key-value pairs.
 *         schema:
 *           type: string
 *       - in: query
 *         name: populate
 *         description: Comma-separated list of related entities to populate.
 *         schema:
 *           type: string
 *       - in: query
 *         name: select
 *         description: Comma-separated list of fields to select from the variations
 *         schema:
 *           type: string
 *       - in: query
 *         name: country
 *         description: Filter products by country.
 *         schema:
 *           type: string
 *       - in: query
 *         name: award
 *         description: Filter products by award.
 *         schema:
 *           type: string
 *       - in: query
 *         name: sub_category
 *         description: Filter products by sub-category.
 *         schema:
 *           type: string
 *       - in: query
 *         name: child_category
 *         description: Filter products by child category.
 *         schema:
 *           type: string
 *       - in: query
 *         name: parent_category
 *         description: Filter products by parent category.
 *         schema:
 *           type: string
 *       - in: query
 *         name: seller
 *         description: Filter products by seller.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with the list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: integer
 *                   description: The starting index of the returned products.
 *                 size:
 *                   type: integer
 *                   description: The number of products returned.
 *                 count:
 *                   type: integer
 *                   description: The total count of products matching the filters.
 *                 productList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Internal Server Error
 */
router.get("/get-products-list/name", getProductsListName);

/**
 * @swagger
 * /v1/products/get-products-list/id:
 *   get:
 *     summary: Get a list of products by ID
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: fields
 *         description: Comma-separated list of fields to include in the response
 *         schema:
 *           type: string
 *       - in: query
 *         name: query
 *         description: Filter conditions in the format of key-value pairs
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         description: Sorting criteria in the format of key-value pairs
 *         schema:
 *           type: string
 *       - in: query
 *         name: populate
 *         description: Comma-separated list of related entities to populate
 *         schema:
 *           type: string
 *       - in: query
 *         name: select
 *         description: Comma-separated list of fields to select from the variations
 *         schema:
 *           type: string
 *       - in: query
 *         name: country
 *         description: Filter by country
 *         schema:
 *           type: string
 *       - in: query
 *         name: award
 *         description: Filter by award
 *         schema:
 *           type: string
 *       - in: query
 *         name: sub_category
 *         description: Filter by sub category
 *         schema:
 *           type: string
 *       - in: query
 *         name: child_category
 *         description: Filter by child category
 *         schema:
 *           type: string
 *       - in: query
 *         name: parent_category
 *         description: Filter by parent category
 *         schema:
 *           type: string
 *       - in: query
 *         name: seller
 *         description: Filter by seller
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response. Returns a list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: integer
 *                   description: Starting index of the returned products
 *                 size:
 *                   type: integer
 *                   description: Number of products per page
 *                 count:
 *                   type: integer
 *                   description: Total count of products
 *                 productList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 */
router.get("/get-products-list/id", getProductsListId);

/**
 * @swagger
 * /v1/products/get-all-products:
 *   get:
 *     summary: Get all products for B2C page
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: fields
 *         description: Comma-separated list of fields to include in the response
 *         schema:
 *           type: string
 *       - in: query
 *         name: query
 *         description: Filter conditions in the format of key-value pairs
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         description: Sorting criteria in the format of key-value pairs
 *         schema:
 *           type: string
 *       - in: query
 *         name: populate
 *         description: Comma-separated list of related entities to populate
 *         schema:
 *           type: string
 *       - in: query
 *         name: select
 *         description: Comma-separated list of fields to select from the variations
 *         schema:
 *           type: string
 *       - in: query
 *         name: country
 *         description: Filter by country
 *         schema:
 *           type: string
 *       - in: query
 *         name: award
 *         description: Filter by award
 *         schema:
 *           type: string
 *       - in: query
 *         name: sub_category
 *         description: Filter by sub category
 *         schema:
 *           type: string
 *       - in: query
 *         name: child_category
 *         description: Filter by child category
 *         schema:
 *           type: string
 *       - in: query
 *         name: parent_category
 *         description: Filter by parent category
 *         schema:
 *           type: string
 *       - in: query
 *         name: seller
 *         description: Filter by seller
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response. Returns a list of products for B2C page.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: integer
 *                   description: Starting index of the returned products
 *                 size:
 *                   type: integer
 *                   description: Number of products per page
 *                 count:
 *                   type: integer
 *                   description: Total count of products
 *                 productList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 */
router.get("/get-all-products", getAllProductPageB2C);

/**
 * @swagger
 * /v1/products//get-product/{id}:
 *   get:
 *     summary: Get a B2C product by ID
 *     tags:
 *       - Product
 *     description: Retrieve a B2C product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to retrieve.
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *         required: true
 *     responses:
 *       200:
 *         description: The B2C product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error.
 */
router.get("/get-product/:id", getProductPageB2C);

/**
 * @swagger
 * /v1/products/get-all-products-b2b:
 *   get:
 *     summary: Get all B2B products with pagination and filtering
 *     tags:
 *       - Product
 *     description: Retrieve a list of B2B products with pagination and filtering options.
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: fields
 *         description: Comma-separated list of fields to include in the response
 *         schema:
 *           type: string
 *       - in: query
 *         name: query
 *         description: Filter conditions in the format of key-value pairs
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         description: Sorting criteria in the format of key-value pairs
 *         schema:
 *           type: string
 *       - in: query
 *         name: populate
 *         description: Comma-separated list of related entities to populate
 *         schema:
 *           type: string
 *       - in: query
 *         name: select
 *         description: Comma-separated list of fields to select from the variations
 *         schema:
 *           type: string
 *       - in: query
 *         name: country
 *         description: Filter products by country name
 *         schema:
 *           type: string
 *       - in: query
 *         name: award
 *         description: Filter products by award name
 *         schema:
 *           type: string
 *       - in: query
 *         name: sub_category
 *         description: Filter products by sub-category name
 *         schema:
 *           type: string
 *       - in: query
 *         name: child_category
 *         description: Filter products by child-category name
 *         schema:
 *           type: string
 *       - in: query
 *         name: parent_category
 *         description: Filter products by parent-category name
 *         schema:
 *           type: string
 *       - in: query
 *         name: seller
 *         description: Filter products by seller name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A paginated list of B2B products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: integer
 *                   description: The starting index of the products.
 *                 to:
 *                   type: integer
 *                   description: The ending index of the products.
 *                 total:
 *                   type: integer
 *                   description: The total count of B2B products.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error.
 */
router.get("/get-all-products-b2b", getAllProductPageB2B);

/**
 * @swagger
 * /v1/products/get-product-b2b/{id}:
 *   get:
 *     summary: Get a B2B product by ID
 *     tags:
 *       - Product
 *     description: Retrieve a B2B product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to retrieve.
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *         required: true
 *     responses:
 *       200:
 *         description: The B2B product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error.
 */
router.get("/get-product-b2b/:id", getProductPageB2B);

/**
 * @swagger
 * /v1/products/remove/{id}:
 *   post:
 *     summary: Remove a product by ID
 *     tags:
 *       - Product
 *     description: Remove a product and its associated inventory and award by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to remove.
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *         required: true
 *     responses:
 *       200:
 *         description: The product was successfully removed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the removal was successful.
 *                   example: true
 *       500:
 *         description: Internal server error.
 */
router.post("/remove/:id", removeById);

/**
 * @swagger
 * /v1/products/edit/{id}:
 *   post:
 *     summary: Edit a product by ID
 *     tags:
 *       - Product
 *     description: Edit a product and update its associated inventory and awards by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to edit.
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *         required: true
 *       - in: body
 *         name: productInfo
 *         description: The updated product information.
 *         schema:
 *           $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the update was successful.
 *                   example: true
 *                 updated_product:
 *                   $ref: '#/components/schemas/Product'
 *                 updated_inventory:
 *                   $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: No records found for the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating no records found.
 *                   example: No records found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the failure to update.
 */
router.post("/edit/:id", edit);

module.exports = router;
