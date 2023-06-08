const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const router = express.Router()

const countryController = require("../../controllers/country/country")

// Import the Swagger options from config/swagger.js
const swaggerOptions = require('../../../config/swagger');

const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * @swagger
 * basePath: /v1
 * tags:
 *   name: Country
 *   description: API endpoints for managing countries
 */


/**
 * @swagger
 * /v1/country/add:
 *   post:
 *     summary: Add a new country
 *     tags:
 *       - Country
 *     requestBody:
 *       description: Country data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Country'
 *     responses:
 *       '200':
 *         description: Country added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *       '500':
 *         description: Error occurred while adding country
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/add", countryController.addCountry);

/**
 * @swagger
* /v1/country/update/{id}:
 *   post:
 *     summary: Update an existing country
 *     tags:
 *       - Country
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the country to update
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     requestBody:
 *       description: Country data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Country'
 *     responses:
 *       '200':
 *         description: Country updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *       '404':
 *         description: Country not found
 *       '500':
 *         description: Error occurred while updating country
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/update/:id', countryController.editCountry);

/**
 * @swagger
* /v1/country/single-country/{id}:
 *   get:
 *     summary: Get a single country by ID
 *     tags:
 *       - Country
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the country to retrieve
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     responses:
 *       '200':
 *         description: Data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *       '404':
 *         description: Country not found
 *       '500':
 *         description: Error occurred while retrieving country
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/single-country/:id', countryController.viewSingleCountry);


/**
 * @swagger
* /v1/country/all-country:
 *   get:
 *     summary: Get all countries
 *     tags:
 *       - Country
 *     responses:
 *       '200':
 *         description: Details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *       '500':
 *         description: Error occurred while retrieving countries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/all-country', countryController.viewAllCountries);

/**
 * @swagger
 * /v1/country/delete/{id}:
 *   delete:
 *     summary: Delete a country by ID
 *     tags:
 *       - Country
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the country to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     responses:
 *       '200':
 *         description: Country deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CountryResponse'
 *       '404':
 *         description: Country not found
 *       '500':
 *         description: Error occurred while deleting country
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete('/delete/:id', countryController.deleteCountry);

module.exports = router;