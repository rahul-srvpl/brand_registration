const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');

const { add } = require('../../controllers/categoryAttribute/add');
const { addMany } = require('../../controllers/categoryAttribute/addMany');
const { get } = require('../../controllers/categoryAttribute/get');
const { getById } = require('../../controllers/categoryAttribute/getById');
const { removeById } = require('../../controllers/categoryAttribute/removeById');
const { edit } = require('../../controllers/categoryAttribute/edit');
const { getPopulated } = require('../../controllers/categoryAttribute/getPopulated');
const { getByIdPopulated } = require('../../controllers/categoryAttribute/getByIdPopulated');

const router = express.Router();

// Import the Swagger options from config/swagger.js
const swaggerOptions = require('../../../config/swagger');

const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * @swagger
 * basePath: /v1
 * tags:
 *   name: CategoryAttribute
 *   description: API endpoints for managing category attributes
 */


/**
 * @swagger
 * /v1/category-attributes/add:
 *   post:
 *     summary: Add a new category attribute
 *     tags: [CategoryAttribute]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryAttribute'
 *           example:
 *             attribute_id: abc123
 *             category_id: def456
 *             required: true
 *             recommended: false
 *     responses:
 *       '200':
 *         description: Category attribute added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 added_entry:
 *                   $ref: '#/components/schemas/CategoryAttribute'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.post("/add", add);

/**
 * @swagger
 * /v1/category-attributes/add-many:
 *   post:
 *     summary: Add multiple category attributes
 *     tags: [CategoryAttribute]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/CategoryAttribute'
 *           example:
 *             - attribute_id: abc123
 *               category_id: def456
 *               required: true
 *               recommended: false
 *             - attribute_id: xyz789
 *               category_id: def456
 *               required: false
 *               recommended: true
 *     responses:
 *       '200':
 *         description: Category attributes added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 added_entries:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CategoryAttribute'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.post("/add-many", addMany);

/**
 * @swagger
 * /v1/category-attributes/get:
 *   get:
 *     summary: Retrieve category list
 *     tags: [CategoryAttribute]
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
 *     responses:
 *       '200':
 *         description: Successfully retrieved the category list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: number
 *                   description: The starting index of the returned category list
 *                 size:
 *                   type: number
 *                   description: The number of categories in the returned list
 *                 count:
 *                   type: number
 *                   description: The total count of categories matching the filter
 *                 categoryList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CategoryAttribute'
 *       '500':
 *         description: Error occurred while retrieving the category list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.get("/get", get);

/**
 * @swagger
 * /v1/category-attributes/get/{id}:
 *   get:
 *     summary: Retrieve category by ID
 *     tags: [CategoryAttribute]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the category to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Successfully retrieved the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   $ref: '#/components/schemas/CategoryAttribute'
 *       '500':
 *         description: Error occurred while retrieving the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: string
 *                   description: Detailed error information
 */
router.get("/get/:id", getById);

/**
 * @swagger
 * /v1/category-attributes/remove/{id}:
 *   post:
 *     summary: Remove category by ID
 *     tags: [CategoryAttribute]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the category to remove
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     responses:
 *       '200':
 *         description: Category successfully removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the removal was successful
 *       '404':
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: string
 *                   description: Detailed error information
 *       '500':
 *         description: Error occurred while removing the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: string
 *                   description: Detailed error information
 */
router.post("/remove/:id", removeById);

/**
 * @swagger
 * /v1/category-attributes/edit/{id}:
 *   post:
 *     summary: Edit category by ID
 *     tags: [CategoryAttribute]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the category to edit
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryAttribute'
 *           example:
 *             required: true
 *             recommended: false
 *     responses:
 *       '200':
 *         description: Category successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the update was successful
 *                 updated_entry:
 *                   $ref: '#/components/schemas/CategoryAttribute'
 *       '400':
 *         description: Invalid request body or no records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Error occurred while updating the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.post("/edit/:id", edit);

/**
 * @swagger
 * /v1/category-attributes/get-populated:
 *   get:
 *     summary: Retrieve populated categories
 *     tags: [CategoryAttribute]
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
 *     responses:
 *       '200':
 *         description: Successfully retrieved the populated categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: number
 *                   description: The starting index of the returned category list
 *                 size:
 *                   type: number
 *                   description: The number of categories in the returned list
 *                 count:
 *                   type: number
 *                   description: The total count of categories matching the filter
 *                 categoryList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CategoryAttribute'
 *       '500':
 *         description: Error occurred while retrieving the populated categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.get("/get-populated", getPopulated);

/**
 * @swagger
 * /v1/category-attributes/get-populated/{id}:
 *   get:
 *     summary: Retrieve populated category by ID
 *     tags: [CategoryAttribute]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the category
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     responses:
 *       '200':
 *         description: Successfully retrieved the populated category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   $ref: '#/components/schemas/CategoryAttribute'
 *       '404':
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Error occurred while retrieving the populated category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get("/get-populated/:id", getByIdPopulated);


module.exports = router;
