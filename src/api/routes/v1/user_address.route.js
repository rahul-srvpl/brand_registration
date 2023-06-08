const express = require("express");
const addressController = require("../../controllers/user_address/user_address");
const router = express.Router();

router.post("/add-new-address", addressController.create_address);
router.get("/single-address/:id", addressController.singleAddress);
router.get("/get-all-add/:userId", addressController.viewUser_all_addr);
router.get("/get-add-limit/:userId", addressController.viewUser_all_addr_limit);
router.post("/update-add/:userId/:id", addressController.updateUser_Add);
router.delete("/delete-address/:id", addressController.delete_add);
router.put("/default-address/:userId/:id", addressController.default_Address);

module.exports = router;
