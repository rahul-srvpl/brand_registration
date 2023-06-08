const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const uploadMiddleware = require('../../middlewares/awardCertificateUpload');

const { get } = require('../../controllers/productAwards/get');
const { getCount } = require('../../controllers/productAwards/getCount');
const { getById } = require('../../controllers/productAwards/getById');
const { removeById } = require('../../controllers/productAwards/removeById');
const { getPopulated } = require('../../controllers/productAwards/getPopulated');
const { getByIdPopulated } = require('../../controllers/productAwards/getByIdPopulated');
const { uploadCert } = require('../../controllers/productAwards/uploadCert');

const router = express.Router();

// Import the Swagger options from config/swagger.js
const swaggerOptions = require('../../../config/swagger');

const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * @swagger
 * basePath: /v1
 * tags:
 *   name: ProductAward
 *   description: API endpoints for managing inventory
 */

/**
 * @swagger
 * /v1/product-awards/get:
 *   get:
 *     summary: Get product awards
 *     tags: [ProductAward]
 *     description: Retrieves a list of product awards.
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
 *         description: Product awards retrieved successfully
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
 *                 productAwardList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductAward'
 *       500:
 *         description: Failed to get product awards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/get", get);

/**
 * @swagger
 * /v1/product-awards/get-count:
 *   get:
 *     summary: Get product award count
 *     tags: [ProductAward]
 *     description: Retrieves the count of product awards.
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
 *         description: Product award count retrieved successfully
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
 *                 total_count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductAward'
 *       500:
 *         description: Failed to get award count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/get-count", getCount);

/**
 * @swagger
 * /v1/product-awards/get/{id}:
 *   get:
 *     summary: Get product award by ID
 *     tags: [ProductAward]
 *     description: Retrieves a product award by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the product award to retrieve
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *         required: true
 *     responses:
 *       200:
 *         description: Product award retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productAward:
 *                   $ref: '#/components/schemas/ProductAward'
 *       404:
 *         description: Product award not found
 *       500:
 *         description: Failed to get product award by ID
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
 * /v1/product-awards/remove/{id}:
 *   post:
 *     summary: Remove product award by ID
 *     tags: [ProductAward]
 *     description: Removes a product award by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the product award to remove
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *         required: true
 *     responses:
 *       200:
 *         description: Product award removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Unable to remove product award by ID
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
router.post("/remove/:id", removeById);

/**
 * @swagger
 * /v1/product-awards/get-populated:
 *   get:
 *     summary: Get populated product awards
 *     tags: [ProductAward]
 *     description: Retrieves product awards with populated references to product and award documents.
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
 *         description: Populated product awards retrieved successfully
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
 *                 productAwardList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductAward'
 *       500:
 *         description: Failed to get populated results
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
 * /v1/product-awards/get-populated/{id}:
 *   get:
 *     summary: Get populated product award by ID
 *     tags:
 *       - ProductAward
 *     description: Retrieves a product award with populated references to product and award documents by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the product award
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *         required: true
 *     responses:
 *       200:
 *         description: Populated product award retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productAward:
 *                   $ref: '#/components/schemas/ProductAward'
 *       404:
 *         description: Product award not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to get populated result
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
router.get("/get-populated/:id", getByIdPopulated);

/**
 * @swagger
 * /v1/product-awards/upload:
 *   post:
 *     summary: Upload award certificate
 *     tags: [ProductAward]
 *     description: Uploads an award certificate file to the server and saves its details.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               award_cert:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Certificate uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cert_secure_url:
 *                   type: string
 *                 cert_public_id:
 *                   type: string
 *       500:
 *         description: Failed to upload certificate
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
router.post("/upload", uploadMiddleware, uploadCert);

module.exports = router;
