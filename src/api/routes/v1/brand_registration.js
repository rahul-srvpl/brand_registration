const router = require("express").Router();
const brand_registration_controller = require("../../controllers/brand_registration/brand_registration");

router.post(
  "/registration/:id",
  brand_registration_controller.create_brand_registration
);

router.get(
  "/get_registration-data",
  brand_registration_controller.view_register_data
);

router.get("/get_registration-data/:id", brand_registration_controller.view_single_brand);
router.get("/seller-info/:sellerId", brand_registration_controller.getSellerInfo)


module.exports = router;
