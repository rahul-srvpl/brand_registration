const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');

const { get } = require('../../controllers/inventory/get');
const { getInventoryPage } = require('../../controllers/inventory/getInventoryPage');
const { getById } = require('../../controllers/inventory/getById');
const { getInventoryPageById } = require('../../controllers/inventory/getInventoryPageById');
const { removeById } = require('../../controllers/inventory/removeById');
const { edit } = require('../../controllers/inventory/edit');

const router = express.Router();

// Import the Swagger options from config/swagger.js
const swaggerOptions = require('../../../config/swagger');

const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * @swagger
 * basePath: /v1
 * tags:
 *   name: Inventory
 *   description: API endpoints for managing inventory
 */

/**
 * @swagger
 * /v1/inventory/get:
 *   get:
 *     summary: Get inventory data
 *     tags: [Inventory]
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
 *         description: Inventory data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: integer
 *                   description: Starting index of the returned items
 *                 size:
 *                   type: integer
 *                   description: Number of items per page
 *                 count:
 *                   type: integer
 *                   description: Total count of items matching the query
 *                 inventoryList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inventory'
 */
router.get("/get", get);

/**
 * @swagger
 * /v1/inventory/get-page:
 *   get:
 *     summary: Get inventory page with product and parent product details
 *     tags: [Inventory]
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
 *         description: Inventory page retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: integer
 *                   description: Starting index of the returned items
 *                 size:
 *                   type: integer
 *                   description: Number of items per page
 *                 count:
 *                   type: integer
 *                   description: Total count of items matching the query
 *                 inventoryList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inventory'
 */
router.get("/get-page", getInventoryPage);

/**
 * @swagger
 * /v1/inventory/get/{id}:
 *   get:
 *     summary: Get inventory by ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the inventory
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     responses:
 *       200:
 *         description: Inventory retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       500:
 *         description: Failed to get inventory by ID
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
 *                   description: Error details
 */
router.get("/get/:id", getById);

/**
 * @swagger
 * /v1/inventory/get-page/{id}:
 *   get:
 *     summary: Get inventory page by ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the inventory page
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     responses:
 *       200:
 *         description: Inventory page retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       404:
 *         description: Inventory not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Unable to get inventory
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get("/get-page/:id", getInventoryPageById);

/**
 * @swagger
 * /v1/inventory/remove/{id}:
 *   post:
 *     summary: Remove inventory by ID
 *     tags: [Inventory]
 *     description: Removes an inventory item based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the inventory item to be removed
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     responses:
 *       200:
 *         description: Inventory successfully removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Unable to remove inventory
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/remove/:id", removeById);

/**
 * @swagger
 * /v1/inventory/edit/{id}:
 *   post:
 *     summary: Edit inventory by ID
 *     tags: [Inventory]
 *     description: Updates an existing inventory item.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the inventory item to be updated
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *       - in: body
 *         name: inventory
 *         description: Updated inventory information
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Inventory'
 *     responses:
 *       200:
 *         description: Inventory updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 updated_inventory:
 *                   $ref: '#/components/schemas/Inventory'
 *                 updated_product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid request body or no records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Unable to update inventory
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