const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');

const { add } = require('../../controllers/product_image/add');
const { get } = require('../../controllers/product_image/get');
const { getById } = require('../../controllers/product_image/getById');
const { getByProductId } = require('../../controllers/product_image/getByProductId');
const { removeById } = require('../../controllers/product_image/removeById');
const { edit } = require('../../controllers/product_image/edit');

const router = express.Router();

// Import the Swagger options from config/swagger.js
const swaggerOptions = require('../../../config/swagger');

const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * @swagger
 * basePath: /v1
 * tags:
 *   name: ProductImages
 *   description: API endpoints for managing product images
 */


/**
 * @swagger
 * /v1/product-images/add:
 *   post:
 *     summary: Add product image
 *     description: Uploads and adds a new product image.
 *     tags:
 *       - ProductImages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *               main_img:
 *                 type: string
 *               img_2:
 *                 type: string
 *               img_3:
 *                 type: string
 *               img_4:
 *                 type: string
 *               img_5:
 *                 type: string
 *               img_6:
 *                 type: string
 *               img_7:
 *                 type: string
 *               img_8:
 *                 type: string
 *             example:
 *               product_id: 611a4db6e49d6f28e066e4e1
 *               main_img: "base64 encoded string or URL"
 *               img_2: "base64 encoded string or URL"
 *               img_3: "base64 encoded string or URL"
 *               img_4: "base64 encoded string or URL"
 *               img_5: "base64 encoded string or URL"
 *               img_6: "base64 encoded string or URL"
 *               img_7: "base64 encoded string or URL"
 *               img_8: "base64 encoded string or URL"
 *     responses:
 *       200:
 *         description: Successful operation. Returns the added product image.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductImage'
 *       500:
 *         description: Failed to add product image.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Failed to add product image
 */
router.post("/add", add);

/**
 * @swagger
 * /v1/product-images/get:
 *   get:
 *     tags:
 *       - ProductImages
 *     summary: Get a list of images with pagination and filtering
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
 *         description: A list of images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: integer
 *                   description: The starting index of the returned results
 *                 size:
 *                   type: integer
 *                   description: The number of items per page
 *                 count:
 *                   type: integer
 *                   description: The total number of items matching the filter criteria
 *                 imageList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductImage'
 *       '500':
 *         description: Failed to get the image list
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
 *                   description: Detailed error description
 */
router.get("/get", get);

/**
 * @swagger
 * /v1/product-images/get/{id}:
 *   get:
 *     tags:
 *       - ProductImages
 *     summary: Get an image by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the image to retrieve
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     responses:
 *       '200':
 *         description: The retrieved image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 image_list:
 *                   $ref: '#/components/schemas/ProductImage'
 *       '500':
 *         description: Failed to get the image by ID
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
 *                   description: Detailed error description
 */
router.get("/get/:id", getById);

/**
 * @swagger
 * /v1/product-images/get/product/{id}:
 *   get:
 *     tags:
 *       - ProductImages
 *     summary: Get image list by product ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the product to retrieve the image list for
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     responses:
 *       '200':
 *         description: The retrieved image list for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 image_list:
 *                   $ref: '#/components/schemas/ProductImage'
 *       '500':
 *         description: Failed to get the image list by product ID
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
 *                   description: Detailed error description
 */
router.get("/get/product/:id", getByProductId);

/**
 * @swagger
 * /v1/product-images/remove/{id}:
 *   post:
 *     tags:
 *       - ProductImages
 *     summary: Remove product image by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the product image to remove
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *     responses:
 *       '200':
 *         description: Product image successfully removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the removal was successful
 *       '404':
 *         description: Product image not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       '500':
 *         description: Unable to remove the product image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.post("/remove/:id", removeById);

/**
 * @swagger
 * /v1/product-images/edit/{id}:
 *   post:
 *     tags:
 *       - ProductImages
 *     summary: Edit product image by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the product image to edit
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: 609b47b320faa92d7044f5c3
 *       - in: body
 *         name: body
 *         description: Updated product image data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             main_img:
 *               type: string
 *               description: URL or base64-encoded image for the main image
 *             img_2:
 *               type: string
 *               description: URL or base64-encoded image for image 2
 *             img_3:
 *               type: string
 *               description: URL or base64-encoded image for image 3
 *             img_4:
 *               type: string
 *               description: URL or base64-encoded image for image 4
 *             img_5:
 *               type: string
 *               description: URL or base64-encoded image for image 5
 *             img_6:
 *               type: string
 *               description: URL or base64-encoded image for image 6
 *             img_7:
 *               type: string
 *               description: URL or base64-encoded image for image 7
 *             img_8:
 *               type: string
 *               description: URL or base64-encoded image for image 8
 *     responses:
 *       '200':
 *         description: Product image successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductImage'
 *             example:
 *               _id: 609b47b320faa92d7044f5c3
 *               product_id: 609b47b320faa92d7044f5c2
 *               main_img: https://example.com/images/main_img_updated.jpg
 *               img_2: https://example.com/images/img_2_updated.jpg
 *               img_3: https://example.com/images/img_3_updated.jpg
 *               img_4: https://example.com/images/img_4_updated.jpg
 *               img_5: https://example.com/images/img_5_updated.jpg
 *               img_6: https://example.com/images/img_6_updated.jpg
 *               img_7: https://example.com/images/img_7_updated.jpg
 *               img_8: https://example.com/images/img_8_updated.jpg
 *       '400':
 *         description: Invalid request body
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       '404':
 *         description: Product image not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       '500':
 *         description: Unable to update the product image
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

module.exports = router;
