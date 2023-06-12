const brand_registration_model = require("../../models/brand_register");
const Seller = require("../../models/seller_auth");
const cloudinary = require("../../utils/cloudinary");
const logger = require("../../../config/logger");

const Joi = require("joi");

const brandRegistrationSchema = Joi.object({
  seller_id: Joi.string().required(),
  brand_name: Joi.string().required(),
  brand_logo: Joi.string().required(),
  brand_description: Joi.string().required(),
  trademark_office: Joi.string().required(),
  trademark_reg_no: Joi.string().required(),
  trademark_status: Joi.string().valid("registered", "pending").required(),
  trademark_type: Joi.string().valid("word mark", "device mark").required(),
  product_images: Joi.string().required(),
  is_seller: Joi.boolean().default(false),
  is_selling_acount: Joi.string().default("NA"),
  is_vendor: Joi.boolean().default(false),
  vendor_code: Joi.string(),
  is_neither: Joi.boolean().default(false),
  product_category_id: Joi.array().items(Joi.string().required()).required(),
  ASINs_no: Joi.array().items(Joi.string()),
  url_brands_official_website: Joi.array().items(Joi.string()),
  sell_to_distributors: Joi.string().valid("yes", "no").default("no"),
  distributors_sell_on_amazone: Joi.string().valid("yes", "no").default("no"),
  product_distributed_to_country_id: Joi.string(),
  license_information: Joi.string().valid("yes", "no").default("no"),
  is_license_sell_on_amazon: Joi.string().valid("yes", "no").default("no"),
});

exports.create_brand_registration = async (req, res) => {
  try {
    const { error } = brandRegistrationSchema.validate(req.body);
    if (error) {
      const errorMessage = `Invalid brand data: ${error.details[0].message}`;
      logger.error(errorMessage);
      console.log(errorMessage);
      return res.status(400).send({ error: error.details[0].message });
    }

    const { brand_name } = req.body;

    // Check if the brand already exists
    const existingBrand = await brand_registration_model.findOne({
      brand_name,
    });
    if (existingBrand) {
      const errorMessage = `Brand '${brand_name}' already exists. Brand registration not allowed.`;
      logger.error(errorMessage);
      console.log(errorMessage);
      return res.status(400).send({ error: "Brand already exists" });
    }

    const logoUploadResponse = await cloudinary.uploader.upload(
      req.body.brand_logo,
      {
        upload_preset: "21genx_brands",
      }
    );

    const brand_logo_url = logoUploadResponse.secure_url;
    const brand_logo_public_id = logoUploadResponse.public_id;

    const uploadResponses = await cloudinary.uploader.upload(
      req.body.product_images,
      {
        upload_preset: "21genx_brand_product_images",
      }
    );

    const brand_product_url = uploadResponses.secure_url;
    const brand_product_public_id = uploadResponses.public_id;

    const registration_data = new brand_registration_model(req.body);

    registration_data.brand_logo = {
      url: brand_logo_url,
      public_id: brand_logo_public_id,
    };

    registration_data.product_images = {
      url: brand_product_url,
      public_id: brand_product_public_id,
    };

    console.log(">>>>>>>>>", registration_data);
    const saved_registration_data = await registration_data.save();
    const logMessage = `Brand registration successfully done: ${saved_registration_data}`;
    logger.info(logMessage);
    console.log(logMessage);
    res.status(200).send({
      msg: "Brand registration successfully done.",
      data: saved_registration_data,
    });
  } catch (error) {
    const errorMessage = `Error occurred while brand registration: ${error}`;
    logger.error(errorMessage);
    console.error(error);
    res.status(500).json({ error: "Error occurred while brand registration" });
  }
};

exports.view_register_data = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const countPromise = brand_registration_model.countDocuments();
    const dataPromise = brand_registration_model
      .aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "product_category_id",
            foreignField: "_id",
            as: "product_category_details",
          },
        },
        {
          $lookup: {
            from: "countries",
            localField: "product_distributed_to_country_id",
            foreignField: "_id",
            as: "Country",
          },
        },
        {
          $project: {
            seller_id: 1,
            brand_name: 1,
            brand_logo: 1,
            brand_description: 1,
            trademark_office: 1,
            trademark_reg_no: 1,
            trademark_status: 1,
            trademark_type: 1,
            seller: 1,
            vendor: 1,
            vendor_code: 1,
            neither: 1,
            ASINs_no: 1,
            "product_category_details.category_name": 1,
            url_brands_official_website: 1,
            sell_to_distributors: 1,
            distributors_sell_on_amazone: 1,
            "Country.country_name": 1,
            "Country.image": 1,
            license_information: 1,
            is_license_sell_on_amazon: 1,
            images: 1,
          },
        },
        { $skip: skip },
        { $limit: pageSize },
      ])
      .exec();

    const [count, data] = await Promise.all([countPromise, dataPromise]);

    const totalPages = Math.ceil(count / pageSize);

    const response = {
      totalItems: count,
      totalPages: totalPages,
      currentPage: pageNumber,
      pageSize: pageSize,
      data: data,
    };

    const logMessage = `Brand registration data fetched successfully: ${data}`;
    logger.info(logMessage);
    console.log(logMessage);
    res.status(200).send({
      msg: "Data fetched successfully",
      data: response,
    });
  } catch (error) {
    const errorMessage = `Error occurred while fetching brand data: ${error}`;
    logger.error(errorMessage);
    console.error(error);
    res.status(500).json({ error: "Error occurred while fetching brand data" });
  }
};

exports.view_single_brand = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await brand_registration_model
      .aggregate([
        {
          $match: {
            $expr: {
              $eq: [{ $toString: "$_id" }, id],
            },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "product_category_id",
            foreignField: "_id",
            as: "product_category_details",
          },
        },
        {
          $lookup: {
            from: "countries",
            localField: "product_distributed_to_country_id",
            foreignField: "_id",
            as: "Country",
          },
        },
        {
          $project: {
            seller_id: 1,
            brand_name: 1,
            brand_logo: 1,
            brand_description: 1,
            trademark_office: 1,
            trademark_reg_no: 1,
            trademark_status: 1,
            trademark_type: 1,
            seller: 1,
            vendor: 1,
            vendor_code: 1,
            neither: 1,
            ASINs_no: 1,
            "product_category_details.category_name": 1,
            url_brands_official_website: 1,
            sell_to_distributors: 1,
            distributors_sell_on_amazone: 1,
            "Country.country_name": 1,
            "Country.image": 1,
            license_information: 1,
            is_license_sell_on_amazon: 1,
            images: 1,
          },
        },
      ])
      .exec();

    if (data.length === 0) {
      return res
        .status(404)
        .json({ error: "Brand registration data not found" });
    }

    const logMessage = `Brand registration data fetched successfully: ${data}`;
    logger.info(logMessage);
    console.log(logMessage);
    res.status(200).send({
      msg: "Data fetched successfully",
      data: data[0],
    });
  } catch (error) {
    const errorMessage = `Error occurred while fetching brand data: ${error}`;
    logger.error(errorMessage);
    console.error(error);
    res.status(500).json({ error: "Error occurred while fetching brand data" });
  }
};

exports.getSellerInfo = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    const { seller_id, store_name } = seller;
    res.status(200).json({ seller_id, store_name });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error occurred while retrieving seller information" });
  }
};

exports.get_brand_by_seller_id = async (req, res) => {
  try {
    const { seller_id } = req.params;
    const brand = await brand_registration_model.find({ seller_id });
    if (brand.length === 0) {
      return res.status(404).json({ error: "Seller has no brand" });
    }
    const { _id, brand_name } = brand[0];
    res.status(200).json({ _id, brand_name });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error occurred while retrieving seller information" });
  }
};

exports.get_brand_by_seller_id = async (req, res) => {
  try {
    const { seller_id } = req.params;
    const brand = await brand_registration_model.find({ seller_id });
    if (brand.length === 0) {
      return res.status(404).json({ error: "Seller has no brand" });
    }
    const { _id, brand_name } = brand[0];
    res.status(200).json({ _id, brand_name });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error occurred while retrieving seller information" });
  }
};

exports.update_brand_registration = async (req, res) => {
  try {
    const { brand_name, brand_logo, product_images } = req.body;

    const existingBrand = await brand_registration_model.findOne({
      brand_name,
    });
    if (!existingBrand) {
      const errorMessage = `Brand '${brand_name}' does not exist. Brand update not allowed.`;
      logger.error(errorMessage);
      console.log(errorMessage);
      return res.status(400).send({ error: "Brand does not exist" });
    }

    if (existingBrand.brand_logo && existingBrand.brand_logo.public_id) {
      await cloudinary.uploader.destroy(existingBrand.brand_logo.public_id);
    }

    if (existingBrand.product_images && existingBrand.product_images.public_id) {
      await cloudinary.uploader.destroy(existingBrand.product_images.public_id);
    }

    if (brand_logo) {
      const logoUploadResponse = await cloudinary.uploader.upload(brand_logo, {
        upload_preset: "21genx_brands",
      });

      const brand_logo_url = logoUploadResponse.secure_url;
      const brand_logo_public_id = logoUploadResponse.public_id;

      existingBrand.brand_logo = {
        url: brand_logo_url,
        public_id: brand_logo_public_id,
      };
    }

    if (product_images) {
      const uploadResponses = await cloudinary.uploader.upload(product_images, {
        upload_preset: "21genx_brand_product_images",
      });

      const brand_product_url = uploadResponses.secure_url;
      const brand_product_public_id = uploadResponses.public_id;

      existingBrand.product_images = {
        url: brand_product_url,
        public_id: brand_product_public_id,
      };
    }

    existingBrand.set(req.body);
    const updatedBrand = await existingBrand.save();

    const logMessage = `Brand registration successfully updated: ${updatedBrand}`;
    logger.info(logMessage);
    console.log(logMessage);
    res.status(200).send({
      msg: "Brand registration successfully updated.",
      data: updatedBrand,
    });
  } catch (error) {
    const errorMessage = `Error occurred while updating brand registration: ${error}`;
    logger.error(errorMessage);
    console.error(error);
    res
      .status(500)
      .json({ error: "Error occurred while updating brand registration" });
  }
};

exports.delete_brand_registration = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await brand_registration_model.findById(id);
    if (!brand) {
      return res.status(404).json({ error: "Brand registration not found" });
    }

    if (brand.brand_logo && brand.brand_logo.public_id) {
      await cloudinary.uploader.destroy(brand.brand_logo.public_id);
    }
    if (brand.product_images && brand.product_images.public_id) {
      await cloudinary.uploader.destroy(brand.product_images.public_id);
    }

    await brand.remove();

    const logMessage = `Brand registration successfully deleted: ${brandId}`;
    logger.info(logMessage);
    console.log(logMessage);
    res.status(200).json({ msg: "Brand registration successfully deleted" });
  } catch (error) {
    const errorMessage = `Error occurred while deleting brand registration: ${error}`;
    logger.error(errorMessage);
    console.error(error);
    res
      .status(500)
      .json({ error: "Error occurred while deleting brand registration" });
  }
};
