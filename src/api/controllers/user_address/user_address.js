const Joi = require("joi");
const userAddressModel = require("../../models/user_address");
const logger = require('../../../config/logger');

const addressSchema = Joi.object({
  userId: Joi.string().required(),
  name: Joi.string().required(),
  mobile: Joi.string().required(),
  alterNativeMobile: Joi.string(),
  pincode: Joi.string().required(),
  house_address: Joi.string().required(),
  area_address: Joi.string().required(),
  landmark: Joi.string(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  addressType: Joi.string().required(),
  delevery_instruction: Joi.string(),
  isDefault: Joi.boolean(),
});


exports.create_address = async (req, res) => {
  try {
    const { error } = addressSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      userId,
      name,
      mobile,
      alterNativeMobile,
      pincode,
      house_address,
      area_address,
      landmark,
      city,
      state,
      country,
      addressType,
      delevery_instruction,
      isDefault,
    } = req.body;

    const existingAddresses = await userAddressModel.find({ userId });

    existingAddresses.forEach(async (address) => {
      if (address._id != req.params.id) {
        address.isDefault = false;
        await address.save();
      }
    });

    const newUserAddress = new userAddressModel({
      userId,
      name,
      mobile,
      alterNativeMobile,
      pincode,
      house_address,
      area_address,
      landmark,
      city,
      state,
      country,
      addressType,
      delevery_instruction,
      isDefault: isDefault || false, // Set isDefault to false by default
    });

    if (isDefault) {
      newUserAddress.isDefault = true;
    }

    await newUserAddress.save();

    res.json(newUserAddress);
  } catch (err) {
    const errorMessage = `Something went wrong in creating address: ${err.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    res.status(500).json({ message: "Server error" });
  }
};


exports.singleAddress = (req, res) => {
  try {
    userAddressModel.findById({ _id: req.params.id }).then((data) => {
      res.status(200).send({ msg: "Address fetch successful", data: data });
    });
  } catch (error) {
    const errorMessage = `Something went wrong in fetching single address: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    res.status(400).send({ error: error });
  }
};

exports.viewUser_all_addr = (req, res) => {
  try {
    userAddressModel.find({ userId: req.params.userId }).then((data) => {
      return res.send({
        status: true,
        msg: "Details fetched successfully",
        data: data,
      });
    });
  } catch (error) {
    const errorMessage = `Something went wrong in viewing all addresses: ${error.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    return res.send({
      status: false,
      msg: "Something went wrong",
      error: error,
    });
  }
};

exports.viewUser_all_addr_limit = (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    userAddressModel
      .find({ userId: req.params.userId })
      .limit(limit)
      .exec()
      .then((data) => {
        return res.send({
          status: true,
          msg: "Details fetched successfully",
          data: data,
        });
      });
  } catch (error) {
    const errorMessage = `Something went wrong in viewing addresses with limit: ${error.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    return res.send({
      status: false,
      msg: "Something went wrong",
      error: error,
    });
  }
};

exports.updateUser_Add = async (req, res) => {
  try {
    const userId = req.params.userId; // Retrieve userId from the request parameters

    const existingAddresses = await userAddressModel.find({ userId });

    for (const address of existingAddresses) {
      if (address._id !== req.params.addressId) {
        address.isDefault = false;
        await address.save();
      }
    }

    const updateAddress = await userAddressModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updateAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (req.body.isDefault) {
      updateAddress.isDefault = true;
    }

    await updateAddress.save();

    res.json(updateAddress);
  } catch (error) {
    const errorMessage = `Something went wrong in updating address: ${error.message}`;
    return res.send({
      status: false,
      msg: "Something went wrong",
      error: error,
    });
  }
};

exports.delete_add = async (req, res) => {
  try {
    const data = await userAddressModel.findByIdAndDelete({
      _id: req.params.id,
    });
    res.status(200).send({
      success: true,
      message: `User's data deleted successfully.`,
      result: data,
    });
  } catch (error) {
    const errorMessage = `Something went wrong in deleting address: ${error.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    res.status(500).send({ message: "Something went wrong." });
  }
};

exports.default_Address = async (req, res) => {
  try {
    const userId = req.params.userId;
    const addressId = req.params.id;
    const address = await userAddressModel.findOne({
      userId: userId,
      _id: addressId,
    });
    if (!address) {
      res.status(404).json({ message: "Address not found." });
    } else {
      await userAddressModel.updateOne(
        { userId: userId, isDefault: true },
        { isDefault: false }
      );
      address.isDefault = true;
      await address.save();
      res
        .status(200)
        .json({
          message: "Default address updated successfully.",
          data: address,
        });
    }
  } catch (error) {
    const errorMessage = `Something went wrong in updating default address: ${error.message}`;
    console.log(errorMessage);
    logger.error(errorMessage);
    res.status(500).json({ message: "Server error." });
  }
};
