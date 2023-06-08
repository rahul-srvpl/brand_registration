const logger = require('../../../config/logger');
const ProductImage = require('../../models/product_image');
const cloudinary = require("../../utils/cloudinary");

exports.removeById = async (req, res, next) => {
  const imageId = req.params.id;

  try {
    const productImage = await ProductImage.findById(imageId);
    if (!productImage) {
      const errorMessage = `Product image not found for ID: ${imageId}`;
      console.log(errorMessage);
      logger.error(errorMessage);
      return res.status(404).send("Product image not found");
    }

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(productImage.image_public_id);

    // Remove the document from the database
    await ProductImage.findByIdAndDelete(imageId);

    console.log(`Product image with ID ${imageId} has been successfully removed`);
    res.send({ success: true });
  } catch (err) {
    const errorMessage = `Unable to remove product image by ID ${imageId}: ${err.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    next(err.message);
  }
};
