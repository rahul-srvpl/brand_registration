const mongoose = require('mongoose');
const awardModel = require("../../models/award");
const cloudinary = require("../../utils/cloudinary");

exports.addAward = async (req, res, next) => {
  const { award_name, award_description, country, image } = req.body;

  try {
    if (image) {
      const uploadPromises = [];

      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "21genx_awards",
      });
      uploadPromises.push({ field: "image", value: uploadedResponse.secure_url });
      uploadPromises.push({ field: "image_public_id", value: uploadedResponse.public_id });

      const awardData = { award_name, award_description, country };
      uploadPromises.forEach((item) => {
        awardData[item.field] = item.value;
      });

      const award = new awardModel(awardData);

      const savedAward = await award.save();
      res.status(200).json(savedAward);
    }
  } catch (err) {
    console.log(err.message);
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.editAward = async (req, res, next) => {
  const awardId = req.params.id;
  const { award_name, award_description, country, image } = req.body;

  try {
    const award = await awardModel.findById(awardId);
    if (!award) {
      return res.status(404).send("Award not found");
    }

    const updatePromises = [];

    if (image) {
      await cloudinary.uploader.destroy(award.image_public_id);
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "21genx_awards",
      });
      updatePromises.push({ field: "image", value: uploadedResponse.secure_url });
    }

    const awardData = { award_name, award_description, country };
    updatePromises.forEach((item) => {
      awardData[item.field] = item.value;
    });

    const updatedAward = await awardModel.findByIdAndUpdate(
      awardId,
      awardData,
      { new: true }
    );

    res.status(200).send(updatedAward);
  } catch (err) {
    console.log(err.message);
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.viewSingleAward = async (req, res) => {
  try {
    const data = await awardModel.findById(req.params.id);
    res.status(200).send({
      success: true,
      message: `Award data fetched successfully.`,
      result: data,
    });
  } catch (err) {
    console.log(err.message);
    logger.error(`Failed to fetch award data: ${err.message}`);
    return res.send({
      status: false,
      msg: "Something went wrong",
      error: err.message
    });
  }
};

exports.viewAllAwards = (req, res) => {
  try {
    awardModel.find().then((data) => {
      return res.send({
        status: true,
        msg: "Details fetched successfully",
        data: data,
      });
    });
  } catch (err) {
    console.log(err.message);
    logger.error(`Failed to fetch award details: ${err.message}`);
    return res.send({
      status: false,
      msg: "Something went wrong",
      error: err.message
    });
  }
};

exports.deleteAwards = async (req, res) => {
  try {
    const awardId = req.params.id;
    const award = await awardModel.findById(awardId);
    if (!award) {
      return res.status(404).send("Award not found");
    }

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(award.image_public_id);

    // Remove the award from the database
    const data = await awardModel.findByIdAndDelete(awardId);
    res.status(200).send({
      success: true,
      message: `Award data deleted successfully.`,
      result: data,
    });
  } catch (err) {
    console.log(err.message);
    logger.error(`Failed to delete award data: ${err.message}`);
    res.status(500).send({ message: "Something went wrong.", error: err.message });
  }
};
