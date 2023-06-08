const countryModel = require("../../models/country");
const cloudinary = require("../../utils/cloudinary");
const logger = require('../../../config/logger');

exports.addCountry = async (req, res) => {
  try {
    const { country_name, image } = req.body;

    const uploadResponse = await cloudinary.uploader.upload(image, {
      upload_preset: "21genx_country",
    });

    const country = new countryModel({
      country_name,
      image: uploadResponse.secure_url,
      image_public_id: uploadResponse.public_id,
    });

    const savedCountry = await country.save();

    const logMessage = `Country added successfully: ${savedCountry}`;
    logger.info(logMessage);
    console.log(logMessage);

    res.json({
      msg: "Country added successfully",
      data: savedCountry,
    });
  } catch (error) {
    const errorMessage = `Error occurred while adding country: ${error}`;
    logger.error(errorMessage);
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.editCountry = async (req, res) => {
  try {
    const countryId = req.params.id;
    const { country_name, status, image } = req.body;

    const country = await countryModel.findById(countryId);
    if (!country) {
      const errorMessage = `Country not found with ID: ${countryId}`;
      logger.error(errorMessage);
      console.log(errorMessage);
      return res.status(404).send("Country not found");
    }

    const updatePromises = [];

    if (!image) {
      const updatedCountry = await countryModel.findByIdAndUpdate(
        countryId,
        { country_name, status },
        { new: true }
      );

      const logMessage = `Country name updated successfully: ${updatedCountry}`;
      logger.info(logMessage);
      console.log(logMessage);

      return res.send({
        msg: "Country name updated successfully",
        data: updatedCountry,
      });
    } else {
      await cloudinary.uploader.destroy(country.image_public_id);
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "21genx_country",
      });
      updatePromises.push({ field: "image", value: uploadedResponse.secure_url });
    }

    const countryData = { country_name, status };
    updatePromises.forEach((item) => {
      countryData[item.field] = item.value;
    });

    const updatedCountry = await countryModel.findByIdAndUpdate(
      countryId,
      countryData,
      { new: true }
    );

    const logMessage = `Country updated successfully: ${updatedCountry}`;
    logger.info(logMessage);
    console.log(logMessage);

    res.send({
      msg: "Country updated successfully",
      data: updatedCountry,
    });
  } catch (error) {
    const errorMessage = `Error occurred while editing country: ${error}`;
    logger.error(errorMessage);
    console.error(error);
    res.status(500).send(error);
  }
};

exports.viewSingleCountry = async (req, res) => {
  try {
    const countryId = req.params.id;
    const country = await countryModel.findById(countryId);
    if (!country) {
      const errorMessage = `Country not found with ID: ${countryId}`;
      logger.error(errorMessage);
      console.log(errorMessage);
      return res.status(404).send("Country not found");
    }
    res.send({
      success: true,
      message: "Data fetched successfully.",
      result: country,
    });
  } catch (error) {
    const errorMessage = `Error occurred while viewing single country: ${error}`;
    logger.error(errorMessage);
    console.error(error);
    res.status(500).send({ error: "Something went wrong" });
  }
};

exports.viewAllCountries = async (req, res) => {
  try {
    const countries = await countryModel.find();
    res.send({
      status: true,
      msg: "Details fetched successfully",
      data: countries,
    });
  } catch (error) {
    const errorMessage = `Error occurred while viewing all countries: ${error}`;
    logger.error(errorMessage);
    console.error(error);
    res.status(500).send({ error: "Something went wrong" });
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    const countryId = req.params.id;
    const country = await countryModel.findById(countryId);
    if (!country) {
      const errorMessage = `Country not found with ID: ${countryId}`;
      logger.error(errorMessage);
      console.log(errorMessage);
      return res.status(404).send("Country not found");
    }

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(country.image_public_id);

    // Remove the country from the database
    const deletedCountry = await countryModel.findByIdAndDelete(countryId);

    const logMessage = `Country deleted successfully: ${deletedCountry}`;
    logger.info(logMessage);
    console.log(logMessage);

    res.status(200).send({
      success: true,
      message: `Country deleted successfully.`,
      result: deletedCountry,
    });
  } catch (error) {
    const errorMessage = `Error occurred while deleting country: ${error}`;
    logger.error(errorMessage);
    console.error(error);
    res.status(500).send({ error: "Something went wrong" });
  }
};
