const { error } = require("winston");
const couponModel = require("../../models/coupon");
const Joi = require('joi');
const logger = require('../../../config/logger');

const couponSchema = Joi.object({
  coupon_code: Joi.string().required(),
  description: Joi.string().required(),
  category_type: Joi.string().required(),
  category: Joi.string().required(),
  discount_type: Joi.string().required(),
  discount: Joi.string().required(),
  quantity_type: Joi.string().required(),
  quantity: Joi.number(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
});

exports.create_Coupon = (req, res) => {
  try {
    const { error } = couponSchema.validate(req.body);
    if (error) {
      const errorMessage = `Invalid coupon data: ${error.details[0].message}`;
      logger.error(errorMessage);
      console.log(errorMessage);
      return res.status(400).send({ error: error.details[0].message });
    }

    couponModel({
      coupon_code: req.body.coupon_code,
      description: req.body.description,
      category_type: req.body.category_type,
      category: req.body.category,
      discount_type: req.body.discount_type,
      discount: req.body.discount,
      quantity_type: req.body.quantity_type,
      quantity: req.body.quantity,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
    })
      .save()
      .then((data) => {
        const logMessage = `Coupon created successfully: ${data}`;
        logger.info(logMessage);
        console.log(logMessage);
        res.status(200).send({ msg: "Coupon created successfully", data: data });
      });
  } catch (error) {
    const errorMessage = `Error occurred while creating coupon: ${error}`;
    logger.error(errorMessage);
    console.log(error);
    res.status(500).send({ error: error });
  }
};

exports.showCouponByPopulate = async (req, res) => {
  try {
    const data = await couponModel.find();
    const logMessage = `Data fetched successfully: ${data}`;
    logger.info(logMessage);
    console.log(logMessage);
    res.status(202).send({ msg: "Data fetched successfully", data: data });
  } catch (error) {
    const errorMessage = `Error occurred while fetching coupon data: ${error}`;
    logger.error(errorMessage);
    console.log(error);
    res.send({ error: error });
  }
};

exports.showCouponByIdPopulate = async (req, res) => {
  try {
    const data = await couponModel.findById({ _id: req.params.id });
    const logMessage = `Data fetched successfully: ${data}`;
    logger.info(logMessage);
    console.log(logMessage);
    res.status(202).send({ msg: "Data fetched successfully", data: data });
  } catch (error) {
    const errorMessage = `Error occurred while fetching coupon data: ${error}`;
    logger.error(errorMessage);
    console.log(error);
    res.send({ error: error });
  }
};

exports.updateCoupon = (req, res) => {
  try {
    couponModel
      .findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then((data) => {
        const logMessage = `Data updated successfully: ${data}`;
        logger.info(logMessage);
        console.log(logMessage);
        res.status(202).send({ msg: "Data updated successfully", data: data });
      });
  } catch (error) {
    const errorMessage = `Error occurred while updating coupon data: ${error}`;
    logger.error(errorMessage);
    console.log(error);
    res.send({ error: error });
  }
};

exports.deleteCoupon = (req, res) => {
  try {
    couponModel.findByIdAndDelete({ _id: req.params.id }).then((data) => {
      const logMessage = `Data deleted successfully: ${data}`;
      logger.info(logMessage);
      console.log(logMessage);
      res.status(202).send({ msg: "Data deleted successfully", data: data });
    });
  } catch (error) {
    const errorMessage = `Error occurred while deleting coupon data: ${error}`;
    logger.error(errorMessage);
    console.log(error);
    res.send({ error: error });
  }
};

exports.activateCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    // const { isActive } = req.body.isActive;

    const data = {
      isActive: req.body.isActive,
    };

    // Update the status in the database
    const updatedCoupon = await couponModel.updateOne(
      { _id: id },
      { $set: data }
    );
    const logMessage = `Coupon status updated successfully`;
    logger.info(logMessage);
    console.log(logMessage);
    res.status(200).send({ msg: "Coupon status updated successfully" });
  } catch (error) {
    const errorMessage = `Error occurred while updating coupon status: ${error}`;
    logger.error(errorMessage);
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.CouponSearch = async (req, res) => {
  try {
    await couponModel
      .aggregate([
        {
          $match: {
            $and: [
              {
                $or: [
                  {
                    coupon_code: {
                      $regex: req.body.couponCode,
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          $project: {
            __v: 0,
            createdAt: 0,
            updateAt: 0,
          },
        },
      ])
      .then((data) => {
        console.log("data", data);
        const logMessage = `User search successful: ${data}`;
        logger.info(logMessage);
        console.log(logMessage);
        return res.status(200).json({
          status: true,
          message: "User search successful",
          data: data,
        });
      });
  } catch (error) {
    const errorMessage = `Error occurred during coupon search: ${error}`;
    logger.error(errorMessage);
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Invalid ID. Server error.",
      error: error,
    });
  }
};

exports.paginate = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    const coupons = await couponModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalCoupons = await couponModel.countDocuments();
    const totalPages = Math.ceil(totalCoupons / pageSize);

    res.json({
      coupons,
      pageInfo: {
        page,
        pageSize,
        totalCoupons,
        totalPages,
      },
    });
  } catch (error) {
    const errorMessage = `Error occurred during pagination: ${error}`;
    logger.error(errorMessage);
    console.error(error);
    res.send({ error: error });
  }
};
