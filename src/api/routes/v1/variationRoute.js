const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');

const { get } = require('../../controllers/variation/get');
const { getVariations } = require('../../controllers/variation/getVariations');
const { getById } = require('../../controllers/variation/getById');
const { removeById } = require('../../controllers/variation/removeById');

const router = express.Router();

// Import the Swagger options from config/swagger.js
const swaggerOptions = require('../../../config/swagger');

const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * @swagger
 * basePath: /v1
 * tags:
 *   name: ProductVariation
 *   description: API endpoints for managing product variations
 */

/**
 * @swagger
 * /v1/variations/get:
 *   get:
 *     summary: Get all variations
 *     tags: [ProductVariation]
 *     responses:
 *       200:
 *         description: Returns the list of all variations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: number
 *                   description: The starting index of the returned variations
 *                 size:
 *                   type: number
 *                   description: The number of variations returned
 *                 count:
 *                   type: number
 *                   description: The total count of variations
 *                 variationList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Variation'
 */
router.get("/get", get);


/**
 * @swagger
 * /v1/variations/get-variations:
 *   get:
 *     summary: Get variations with pagination and filtering
 *     tags: [ProductVariation]
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
 *     responses:
 *       200:
 *         description: Successful response with the list of variations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: integer
 *                   description: Starting index of the variations in the response
 *                 to:
 *                   type: integer
 *                   description: Ending index of the variations in the response
 *                 count:
 *                   type: integer
 *                   description: Total count of variations in the response
 *                 data:
 *                   type: array
 *                   description: Array of variations
 *                   items:
 *                     $ref: '#/components/schemas/Variation'
 *       500:
 *         description: Internal server error
 */
router.get("/get-variations", getVariations);


/**
 * @swagger
 * /v1/variations/get/{id}:
 *   get:
 *     summary: Get a variation by ID
 *     tags: [ProductVariation]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the variation to retrieve
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Successful response with the variation data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 variation:
 *                   $ref: '#/components/schemas/Variation'
 *       400:
 *         description: Variation record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating no variation record found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating an error occurred while fetching variation data
 *                 error:
 *                   type: string
 *                   description: Additional error details
 */
router.get("/get/:id", getById);


/**
 * @swagger
 * /v1/variations/remove{id}:
 *   post:
 *     summary: Remove a variation by ID
 *     tags: [ProductVariation]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the variation to remove
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Variation removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the variation was successfully removed
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating an error occurred while removing the variation
 */
router.post("/remove/:id", removeById);

module.exports = router;
