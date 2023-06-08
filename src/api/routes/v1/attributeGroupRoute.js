const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');

const { add } = require('../../controllers/attributeGroup/add');
const { get } = require('../../controllers/attributeGroup/get');
const { getById } = require('../../controllers/attributeGroup/getById');
const { removeById } = require('../../controllers/attributeGroup/removeById');
const { edit } = require('../../controllers/attributeGroup/edit');


const router = express.Router();

// Import the Swagger options from config/swagger.js
const swaggerOptions = require('../../../config/swagger');

const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * @swagger
 * basePath: /v1
 * tags:
 *   name: Attribute Group
 *   description: API endpoint for managing attribute group
 */


/**
 * @swagger
 * /v1/attribute-groups/add:
 *   post:
 *     summary: Add a new attribute group
 *     tags: [Attribute Group]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttributeGroup'
 *           example:
 *             group_slug: sample-group
 *             group_name: Sample Group
 *             group_desc: This is a sample attribute group.
 *             status: active
 *     responses:
 *       '200':
 *         description: Attribute group added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 added_entry:
 *                   $ref: '#/components/schemas/AttributeGroup'
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
router.post("/add", add);

/**
 * @swagger
 * /v1/attribute-groups/get:
 *   get:
 *     summary: Get attribute group data
 *     tags: [Attribute Group]
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
 *         description: Filter query conditions in the format of key-value pairs
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         description: Sorting criteria in the format of key-value pairs
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Attribute group data retrieved successfully
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
 *                     $ref: '#/components/schemas/AttributeGroup'
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
 * /v1/attribute-groups/get/{id}:
 *   get:
 *     summary: Get attribute group by ID
 *     tags: [Attribute Group]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the attribute group to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Attribute group data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 attribute:
 *                   $ref: '#/components/schemas/AttributeGroup'
 *       '400':
 *         description: Attribute group record not found
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
 * /v1/attribute-groups/remove/{id}:
 *   post:
 *     summary: Remove an attribute group by ID
 *     tags: [Attribute Group]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the attribute group to remove
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Attribute group removed successfully
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
 * /v1/attribute-groups/edit/{id}:
 *   post:
 *     summary: Edit an attribute group by ID
 *     tags: [Attribute Group]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the attribute group to edit
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttributeGroup'
 *           example:
 *             group_name: Updated Group Name
 *             group_desc: Updated Group Description
 *             status: draft
 *     responses:
 *       '200':
 *         description: Attribute group updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 updated_entry:
 *                   $ref: '#/components/schemas/AttributeGroup'
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
