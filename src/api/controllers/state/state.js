const stateModel = require("../../models/state");
const Joi = require("joi");
const logger = require('../../../config/logger');

exports.addState = async (req, res) => {
  try {
    const state_data = new stateModel(req.body);
    const stateSchema = Joi.object({
      country_id: Joi.string().required(),
      state_name: Joi.string().required(),
    });
    const { error } = stateSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const result = await state_data.save();
    res.status(201).send({ success: true, added_data: result });
  } catch (error) {
    const errorMessage = `Something went wrong in adding state: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    res.status(500).send({ status: false, msg: "Something went wrong", error });
  }
};

exports.editState = async (req, res) => {
  try {
    const stateSchema = Joi.object({
      country_id: Joi.string(),
      state_name: Joi.string(),
      status: Joi.string()
    });
    const { error } = stateSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const updatedState = await stateModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedState) {
      return res.status(404).send("State not found");
    }
    res.send({
      status: true,
      msg: "State details updated",
      data: updatedState,
    });
  } catch (error) {
    const errorMessage = `Something went wrong in editing state: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    res.status(500).send({ status: false, msg: "Something went wrong", error });
  }
};

exports.viewStateByCountry = async (req, res) => {
  try {
    const data = await stateModel.find({ country_id: req.params.country_id });
    res.status(200).send({
      success: true,
      message: "Data fetched successfully",
      result: data,
    });
  } catch (error) {
    const errorMessage = `Something went wrong in viewing states by country: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    res.status(500).send({ status: false, msg: "Something went wrong", error });
  }
};

exports.viewAllStates = async (req, res) => {
  try {
    const data = await stateModel.find();
    res.send({
      status: true,
      msg: "Details fetched successfully",
      data: data,
    });
  } catch (error) {
    const errorMessage = `Something went wrong in viewing all states: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    res.status(500).send({ status: false, msg: "Something went wrong", error });
  }
};

exports.deleteState = async (req, res) => {
  try {
    const data = await stateModel.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).send("State not found");
    }
    res.status(200).send({
      success: true,
      message: "Data deleted successfully",
      result: data,
    });
  } catch (error) {
    const errorMessage = `Something went wrong in deleting state: ${error.message}`;
    console.error(errorMessage);
    logger.error(errorMessage);
    res.status(500).send({ message: "Something went wrong" });
  }
};
