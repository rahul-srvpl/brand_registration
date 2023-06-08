const express = require('express');
const router = express.Router();

const { edit } = require('../../controllers/user_b2b/edit');
const { get } = require('../../controllers/user_b2b/get');
const { getById } = require('../../controllers/user_b2b/getById');
const { removeById } = require('../../controllers/user_b2b/removeById');

router.post("/edit/:id", edit);
router.get("/get", get);
router.get("/get/:id", getById);
router.post("/remove/:id", removeById);

module.exports = router;
