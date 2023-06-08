const express = require('express');
const handleS3 = require('./s3Handle.route');
const handleCrms = require('./bsCrm.route');
const categoryRoute = require('./categoryRoute');
const attributeRoute = require('./attributeRoute');
const categoryAttributeRoute = require('./categoryAttributeRoute');
const attributeGroupRoute = require('./attributeGroupRoute');
const award = require("./awardRoute");
const country = require("./countryRoute");
const state = require("./stateRoute");
const productRoute = require('./productRoute');
const productImageRoute = require('./productImageRoute');
const inventoryRoute = require('./inventoryRoute');
const productAwardsRoute = require('./productAwardsRoute');
const authRouteB2C = require('./authRouteB2C');
const authRouteB2B = require('./authRouteB2B');
const authRouteAdmin = require('./authRouteAdmin');
const brandRoutes = require("./brand");
const userRouteB2B = require("./userRouteB2B");
const userRouteB2C = require("./userRouteB2C");
const user_address = require("./user_address.route");
const order_table = require("./order_table.route");
const coupon = require('./coupon.route')
const variationRoute = require('./variationRoute')
const brad_registration = require('./brand_registration')


const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

router.use("/s3", handleS3);

router.use("/crm", handleCrms);

router.use("/award", award);

router.use("/products", productRoute);

router.use("/product-images", productImageRoute);

router.use("/country", country);

router.use("/categories", categoryRoute);

router.use("/attributes", attributeRoute);

router.use("/category-attributes", categoryAttributeRoute);

router.use("/attribute-groups", attributeGroupRoute);

router.use("/state", state);

router.use("/inventory", inventoryRoute);

router.use("/product-awards", productAwardsRoute);

router.use("/u-address", user_address);

router.use("/order", order_table);

router.use('/coupon', coupon);

router.use('/variations', variationRoute)

router.use('/auth/b2c', authRouteB2C);
router.use('/auth/b2b', authRouteB2B);
router.use('/auth/admin', authRouteAdmin);

router.use('/user/b2c', userRouteB2C);
router.use('/user/b2b', userRouteB2B);

router.use("/brand", brandRoutes);
router.use('/brand-registration', brad_registration)

module.exports = router;
