const brand_registration_model = require("../../models/brand_register");
const Seller = require("../../models/seller_auth");
const cloudinary = require("../../utils/cloudinary");
const logger = require("../../../config/logger");

exports.create_brand_registration = async (req, res) => {
  try {
    const { error } = brand_registration_model.validate(req.body);
    if (error) {
      const errorMessage = `Invalid brand data: ${error.details[0].message}`;
      logger.error(errorMessage);
      console.log(errorMessage);
      return res.status(400).send({ error: error.details[0].message });
    }
    const {
      brand_name,
      brand_logo,
      brand_description,
      trademark_office,
      trademark_reg_no,
      trademark_status,
      trademark_type,
      images,
      seller,
      is_selling_acount,
      vendor,
      vendor_code,
      neither,
      product_category,
      ASINs_no,
      url_brands_official_website,
      sell_to_distributors,
      distributors_sell_on_amazone,
      product_distributed_to_country,
      license_information,
      is_license_sell_on_amazon,
    } = req.body;

    const logoUploadResponse = await cloudinary.uploader.upload(brand_logo, {
      upload_preset: "21genx_brands",
    });

    const brand_logo_url = logoUploadResponse.secure_url;
    const brand_logo_public_id = logoUploadResponse.public_id;

    const uploadResponses = await cloudinary.uploader.upload(images, {
      upload_preset: "21genx_brand_product_images",
    });

    const brand_product_url = uploadResponses.secure_url;
    const brand_product_public_id = uploadResponses.public_id;

    const registration_data = new brand_registration_model({
      brand_name,
      brand_logo: {
        url: brand_logo_url,
        public_id: brand_logo_public_id,
      },
      brand_description,
      trademark_office,
      trademark_reg_no,
      trademark_status,
      trademark_type,
      seller,
      is_selling_acount,
      vendor,
      vendor_code,
      neither,
      ASINs_no,
      product_category,
      url_brands_official_website,
      sell_to_distributors,
      distributors_sell_on_amazone,
      product_distributed_to_country,
      license_information,
      is_license_sell_on_amazon,
      images: {
        url: brand_product_url,
        public_id: brand_product_public_id,
      },
    });
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
            localField: "product_category",
            foreignField: "_id",
            as: "product_category_details",
          },
        },
        {
          $lookup: {
            from: "countries",
            localField: "product_distributed_to_country",
            foreignField: "_id",
            as: "Country",
          },
        },
        {
          $project: {
            brand_name: 1,
            trademark_office: 1,
            trademark_reg_no: 1,
            trademark_status: 1,
            trademark_type: 1,
            seller: 1,
            vendor: 1,
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
            localField: "product_category",
            foreignField: "_id",
            as: "product_category_details",
          },
        },
        {
          $lookup: {
            from: "countries",
            localField: "product_distributed_to_country",
            foreignField: "_id",
            as: "Country",
          },
        },
        {
          $project: {
            brand_name: 1,
            trademark_office: 1,
            trademark_reg_no: 1,
            trademark_status: 1,
            trademark_type: 1,
            seller: 1,
            vendor: 1,
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
