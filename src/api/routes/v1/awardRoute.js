const router = require("express").Router();
const swaggerJsDoc = require('swagger-jsdoc');
const awardController = require("../../controllers/award/award")

// Import the Swagger options from config/swagger.js
const swaggerOptions = require('../../../config/swagger');

const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * @swagger
 * tags:
 *   name: Awards
 *   description: API endpoints for managing awards
 */


/**
 * @swagger
 * /v1/award/add:
 *   post:
 *     summary: Add an award
 *     tags: [Awards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Award'
 *           example:
 *             award_name: "sourtik"
 *             award_description: "dev"
 *             country: "Bangladesh"
 *             image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/"
 *     responses:
 *       200:
 *         description: Successfully added an award
 *       500:
 *         description: Internal server error
 */
router.post("/add", awardController.addAward);

/**
 * @swagger
 * /v1/award/update/{id}:
 *   post:
 *     summary: Update an award
 *     tags: [Awards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *         required: true
 *         description: ID of the award to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Award'
 *           example:
 *             award_name: "sourtik"
 *             award_description: "updated description"
 *     responses:
 *       200:
 *         description: Successfully updated the award
 *       404:
 *         description: Award not found
 *       500:
 *         description: Internal server error
 */
router.post('/update/:id', awardController.editAward)

/**
 * @swagger
 * /v1/award/single-award/{id}:
 *   get:
 *     summary: Get a single award
 *     tags: [Awards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *         required: true
 *         description: ID of the award to fetch
 *     responses:
 *       200:
 *         description: Successfully retrieved the award
 *       404:
 *         description: Award not found
 *       500:
 *         description: Internal server error
 */
router.get('/single-award/:id', awardController.viewSingleAward)

/**
 * @swagger
 * /v1/award/all-awards:
 *   get:
 *     summary: Get all awards
 *     tags: [Awards]
 *     responses:
 *       200:
 *         description: Successfully retrieved the awards
 *       500:
 *         description: Internal server error
 */
router.get('/all-awards', awardController.viewAllAwards)

/**
 * @swagger
 * /v1/award/delete/{id}:
 *   delete:
 *     summary: Delete an award
 *     tags: [Awards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *         required: true
 *         description: ID of the award to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the award
 *       404:
 *         description: Award not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:id', awardController.deleteAwards)

module.exports = router;

