const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const controller = require('../../controllers/brand/brand');

const router = express.Router();

// Import the Swagger options from config/swagger.js
const swaggerOptions = require('../../../config/swagger');

const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: API endpoints for managing brands
 */


/**
 * @swagger
 * /v1/brand/getBrand/{seller_id}:
 *   get:
 *     summary: Get brands by seller ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: seller_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the seller
 *     responses:
 *       200:
 *         description: Successfully retrieved the brands
 *       404:
 *         description: No seller is found
 *       500:
 *         description: Internal server error
 */
router.get("/getBrand/:seller_id", controller.getBrand);

/**
 * @swagger
 * /v1/brand/createBrand:
 *   post:
 *     summary: Create a brand
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *           example:
 *             seller_id: "64705487e568b045c4eeb06a"
 *             brand_name: "My Brand"
 *             brand_logo_url: "https://example.com/logo.jpg"
 *             brand_logo_url_public_id: "public_id"
 *             brand_desc: "This is my brand"
 *     responses:
 *       200:
 *         description: Successfully created a brand
 *       500:
 *         description: Internal server error
 */
router.post("/createBrand", controller.createBrand);

/**
 * @swagger
 * /v1/brand/updateBrand:
 *   put:
 *     summary: Update a brand
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *           example:
 *             _id: "64705487e568b045c4eeb06a"
 *             brand_logo_url: "https://example.com/new_logo.jpg"
 *             brand_desc: "Updated brand description"
 *     responses:
 *       200:
 *         description: Successfully updated the brand
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Internal server error
 */
router.put("/updateBrand", controller.updateBrandById);

/**
 * @swagger
 * /api/brand/deleteBrand:
 *   delete:
 *     summary: Delete a brand
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *           example:
 *             _id: "64705487e568b045c4eeb06a"
 *     responses:
 *       200:
 *         description: Successfully deleted the brand
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Internal server error
 */
router.delete("/deleteBrand", controller.deleteBrand);


module.exports = router;