const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const ProductImage = require('../../models/product_image');
const cloudinary = require("../../utils/cloudinary");

exports.edit = async (req, res, next) => {
  const productId = req.params.id;
  const { main_img, img_2, img_3, img_4, img_5, img_6, img_7, img_8 } = req.body;

  try {
    const productImage = await ProductImage.findOne({ product_id: productId });
    console.log(productImage);
    if (!productImage) {
      return res.status(404).send("Product image not found");
    }

    const updatePromises = [];

    if (main_img) {
      await cloudinary.uploader.destroy(productImage.main_img_public_id);
      const uploadedResponse = await cloudinary.uploader.upload(main_img, {
        upload_preset: "21genx_products",
      });
      updatePromises.push({ field: "main_img", value: uploadedResponse.secure_url });
    }

    if (img_2) {
      await cloudinary.uploader.destroy(productImage.img_2_public_id);
      const uploadedResponse = await cloudinary.uploader.upload(img_2, {
        upload_preset: "21genx_products",
      });
      updatePromises.push({ field: "img_2", value: uploadedResponse.secure_url });
    }

    if (img_3) {
      await cloudinary.uploader.destroy(productImage.img_3_public_id);
      const uploadedResponse = await cloudinary.uploader.upload(img_3, {
        upload_preset: "21genx_products",
      });
      updatePromises.push({ field: "img_3", value: uploadedResponse.secure_url });
    }

    if (img_4) {
      await cloudinary.uploader.destroy(productImage.img_4_public_id);
      const uploadedResponse = await cloudinary.uploader.upload(img_4, {
        upload_preset: "21genx_products",
      });
      updatePromises.push({ field: "img_4", value: uploadedResponse.secure_url });
    }

    if (img_5) {
      await cloudinary.uploader.destroy(productImage.img_5_public_id);
      const uploadedResponse = await cloudinary.uploader.upload(img_5, {
        upload_preset: "21genx_products",
      });
      updatePromises.push({ field: "img_5", value: uploadedResponse.secure_url });
    }

    if (img_6) {
      await cloudinary.uploader.destroy(productImage.img_6_public_id);
      const uploadedResponse = await cloudinary.uploader.upload(img_6, {
        upload_preset: "21genx_products",
      });
      updatePromises.push({ field: "img_6", value: uploadedResponse.secure_url });
    }

    if (img_7) {
      await cloudinary.uploader.destroy(productImage.img_7_public_id);
      const uploadedResponse = await cloudinary.uploader.upload(img_7, {
        upload_preset: "21genx_products",
      });
      updatePromises.push({ field: "img_7", value: uploadedResponse.secure_url });
    }

    if (img_8) {
      await cloudinary.uploader.destroy(productImage.img_8_public_id);
      const uploadedResponse = await cloudinary.uploader.upload(img_8, {
        upload_preset: "21genx_products",
      });
      updatePromises.push({ field: "img_8", value: uploadedResponse.secure_url });
    }

    const productImageData = {};
    updatePromises.forEach((item) => {
      productImageData[item.field] = item.value;
    });

    const updatedProductImage = await ProductImage.findOneAndUpdate(
      { product_id: productId },
      productImageData,
      { new: true }
    );

    console.log(`Product image updated: ${updatedProductImage._id}`);
    res.status(200).send(updatedProductImage);
  } catch (err) {
    const errorMessage = `Failed to edit product image: ${err.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    res.status(500).send(errorMessage);
  }
};
