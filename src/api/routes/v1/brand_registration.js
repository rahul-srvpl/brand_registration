const router = require("express").Router();
const brand_controller = require("../../controllers/brand_registration/brand_registration");

router.post("/registration/:id", brand_controller.create_brand_registration);

router.get("/get_registration-data", brand_controller.view_register_data);

router.get("/get_registration-data/:id", brand_controller.view_single_brand);

router.get("/seller-info/:sellerId", brand_controller.getSellerInfo);

router.get("/get_seller_brand/:seller_id", brand_controller.get_brand_by_seller_id);

router.post( "/update-seller-details/:id",brand_controller.update_brand_registration);

router.post("/delete-seller-details/:id",brand_controller.delete_brand_registration);

module.exports = router;
