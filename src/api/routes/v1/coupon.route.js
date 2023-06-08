const router = require("express").Router();
const couponController = require("../../controllers/coupons/coupons");

router.post("/add", couponController.create_Coupon);
router.get(
  "/get-All-category-populated",
  couponController.showCouponByPopulate
);
router.get(
  "/get-category-populated/:id",
  couponController.showCouponByIdPopulate
);
router.post("/update-coupon/:id", couponController.updateCoupon);
router.delete("/delete/:id", couponController.deleteCoupon);
router.post("/activate-coupon/:id", couponController.activateCoupon);
router.post("/search", couponController.CouponSearch);
router.get("/paginate-coupon", couponController.paginate);

module.exports = router;
