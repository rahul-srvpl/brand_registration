const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');

const { add} = require('../../controllers/category/add');
const { get } = require('../../controllers/category/get');
const { getById } = require('../../controllers/category/getById');
const { removeById } = require('../../controllers/category/removeById');
const { edit } = require('../../controllers/category/edit');
const { getPopulated } = require('../../controllers/category/getPopulated');
const { getByIdPopulated } = require('../../controllers/category/getByIdPopulated');
const { getCount } = require('../../controllers/category/getCount');

const router = express.Router();

// Import the Swagger options from config/swagger.js
const swaggerOptions = require('../../../config/swagger');

const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * @swagger
 * basePath: /v1
 * tags:
 *   name: Categories
 *   description: API endpoints for managing categories
 */

/**
 * @swagger
 * /v1/categories/add:
 *   post:
 *     summary: Add a category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *           example:
 *             category_slug: "example-category"
 *             status: "active"
 *             category_name: "Example Category"
 *             category_desc: "This is an example category"
 *             category_type: "parent"
 *             parent_category_id: null
 *             sub_category_id: null
 *     responses:
 *       200:
 *         description: Successfully added the category
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/add", add);

/**
 * @swagger
 * /v1/categories/get:
 *   get:
 *     summary: Get categories
 *     tags: [Categories]
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
 *       200:
 *         description: Successfully retrieved categories
 *       500:
 *         description: Internal server error
 */
router.get("/get", get);

/**
 * @swagger
 * /v1/categories/get/count:
 *   get:
 *     summary: Get category count
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Successfully retrieved category count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 parent:
 *                   type: integer
 *                   description: Count of parent categories
 *                 sub:
 *                   type: integer
 *                   description: Count of sub categories
 *                 child:
 *                   type: integer
 *                   description: Count of child categories
 *       500:
 *         description: Internal server error
 */
router.get("/get/count", getCount);

/**
 * @swagger
 * /v1/categories/get/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to retrieve
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     responses:
 *       200:
 *         description: Category data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       500:
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
router.get("/get/:id", getById);

/**
 * @swagger
 * /v1/categories/get-populated:
 *   get:
 *     summary: Get populated categories
 *     tags: [Categories]
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
 *       200:
 *         description: Populated categories retrieved successfully
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
 *                 categoryList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
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
router.get("/get-populated", getPopulated);

/**
 * @swagger
 * /v1/categories/get-populated/{id}:
 *   get:
 *     summary: Get populated category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to retrieve
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     responses:
 *       200:
 *         description: Populated category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/get-populated/:id", getByIdPopulated);

/**
 * @swagger
 * /v1/categories/remove/{id}:
 *   post:
 *     summary: Remove category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to remove
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     responses:
 *       '200':
 *         description: Category removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/remove/:id", removeById);

/**
 * @swagger
 * /v1/categories/edit/{id}:
 *   post:
 *     summary: Edit category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       '200':
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 updated_entry:
 *                   $ref: '#/components/schemas/Category'
 *       '400':
 *         description: Invalid request body or no records found
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
 */
router.post("/edit/:id", edit);

module.exports = router;
