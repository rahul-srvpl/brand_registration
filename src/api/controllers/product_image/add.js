const mongoose = require('mongoose');
const logger = require('../../../config/logger');
const ProductImage = require('../../models/product_image');
const cloudinary = require("../../utils/cloudinary");

exports.add = async (req, res, next) => {
  const { product_id, main_img, img_2, img_3, img_4, img_5, img_6, img_7, img_8 } = req.body;

  try {
    if (main_img || img_2 || img_3 || img_4 || img_5 || img_6 || img_7 || img_8) {
      const uploadPromises = [];

      if (main_img) {
        const uploadedResponse = await cloudinary.uploader.upload(main_img, {
          upload_preset: "21genx_products",
        });
        uploadPromises.push({ field: "main_img", value: uploadedResponse.secure_url });
        uploadPromises.push({ field: "main_img_public_id", value: uploadedResponse.public_id });
      }

      if (img_2) {
        const uploadedResponse = await cloudinary.uploader.upload(img_2, {
          upload_preset: "21genx_products",
        });
        uploadPromises.push({ field: "img_2", value: uploadedResponse.secure_url });
        uploadPromises.push({ field: "img_2_public_id", value: uploadedResponse.public_id });
      }

      if (img_3) {
        const uploadedResponse = await cloudinary.uploader.upload(img_3, {
          upload_preset: "21genx_products",
        });
        uploadPromises.push({ field: "img_3", value: uploadedResponse.secure_url });
        uploadPromises.push({ field: "img_3_public_id", value: uploadedResponse.public_id });
      }

      if (img_4) {
        const uploadedResponse = await cloudinary.uploader.upload(img_4, {
          upload_preset: "21genx_products",
        });
        uploadPromises.push({ field: "img_4", value: uploadedResponse.secure_url });
        uploadPromises.push({ field: "img_4_public_id", value: uploadedResponse.public_id });
      }

      if (img_5) {
        const uploadedResponse = await cloudinary.uploader.upload(img_5, {
          upload_preset: "21genx_products",
        });
        uploadPromises.push({ field: "img_5", value: uploadedResponse.secure_url });
        uploadPromises.push({ field: "img_5_public_id", value: uploadedResponse.public_id });
      }

      if (img_6) {
        const uploadedResponse = await cloudinary.uploader.upload(img_6, {
          upload_preset: "21genx_products",
        });
        uploadPromises.push({ field: "img_6", value: uploadedResponse.secure_url });
        uploadPromises.push({ field: "img_6_public_id", value: uploadedResponse.public_id });
      }

      if (img_7) {
        const uploadedResponse = await cloudinary.uploader.upload(img_7, {
          upload_preset: "21genx_products",
        });
        uploadPromises.push({ field: "img_7", value: uploadedResponse.secure_url });
        uploadPromises.push({ field: "img_7_public_id", value: uploadedResponse.public_id });
      }

      if (img_8) {
        const uploadedResponse = await cloudinary.uploader.upload(img_8, {
          upload_preset: "21genx_products",
        });
        uploadPromises.push({ field: "img_8", value: uploadedResponse.secure_url });
        uploadPromises.push({ field: "img_8_public_id", value: uploadedResponse.public_id });
      }

      const productImageData = { product_id };
      uploadPromises.forEach((item) => {
        productImageData[item.field] = item.value;
      });

      const productImage = new ProductImage(productImageData);

      const savedProductImage = await productImage.save();

      console.log(`Product image added: ${savedProductImage._id}`);
      res.status(200).send(savedProductImage);
    }
  } catch (err) {
    const errorMessage = `Failed to add product image: ${err.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    res.status(500).send(errorMessage)
  }
};
