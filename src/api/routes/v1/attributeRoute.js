const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');

const { add } = require('../../controllers/attribute/add');
const { get } = require('../../controllers/attribute/get');
const { getById } = require('../../controllers/attribute/getById');
const { removeById } = require('../../controllers/attribute/removeById');
const { edit } = require('../../controllers/attribute/edit');


const router = express.Router();

// Import the Swagger options from config/swagger.js
const swaggerOptions = require('../../../config/swagger');

const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * @swagger
 * basePath: /v1
 * tags:
 *   name: Attribute
 *   description: API endpoints for managing attributes
 */

/**
 * @swagger
 * /v1/attributes/add:
 *   post:
 *     summary: Add a new attribute
 *     tags: [Attribute]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attribute'
 *           example:
 *             attribute_slug: size
 *             attribute_name: Size
 *             attribute_group_slug: clothing
 *             attribute_group_name: Clothing
 *             attribute_desc: Attribute description
 *             input_type: select
 *             data_type: string
 *     responses:
 *       '200':
 *         description: Attribute added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 added_entry:
 *                   $ref: '#/components/schemas/Attribute'
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
 * /v1/attributes/get:
 *   get:
 *     summary: Get attribute data
 *     tags: [Attribute]
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
 *         description: Attribute data retrieved successfully
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
 *                 attributeList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Attribute'
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
router.get("/get", get);

/**
 * @swagger
 * /v1/attributes/get/{id}:
 *   get:
 *     summary: Get attribute by ID
 *     tags: [Attribute]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the attribute to retrieve
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     responses:
 *       '200':
 *         description: Attribute data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 attribute:
 *                   $ref: '#/components/schemas/Attribute'
 *       '400':
 *         description: Attribute record not found
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
router.get("/get/:id", getById);

/**
 * @swagger
 * /v1/attributes/remove/{id}:
 *   post:
 *     summary: Remove an attribute by ID
 *     tags: [Attribute]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the attribute to remove
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     responses:
 *       '200':
 *         description: Attribute removed successfully
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
 * /v1/attributes/edit/{id}:
 *   post:
 *     summary: Edit an attribute by ID
 *     tags: [Attribute]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the attribute to edit
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attribute'
 *           example:
 *             attribute_slug: updated_slug
 *             attribute_name: Updated Attribute
 *             attribute_group_slug: updated_group_slug
 *             attribute_group_name: Updated Group
 *             attribute_desc: Updated attribute description
 *             input_type: select
 *             data_type: string
 *             status: draft
 *     responses:
 *       '200':
 *         description: Attribute updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 updated_entry:
 *                   $ref: '#/components/schemas/Attribute'
 *       '400':
 *         description: Bad request or validation error
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
