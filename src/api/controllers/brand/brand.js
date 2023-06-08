const brand = require("../../models/brand");
const { createSchema, updateSchema } = require("./brandJoi");

module.exports = {
    getBrand: async (req, res) => {
        let id = req.params.seller_id;
        console.log("seller_id:", req.params.seller_id);

        if (!id) return res.send({ msg: "Please enter your seller_id" });
        try {
            const sellerInfo = await brand.find({ seller_id: id });
            if (sellerInfo.length == 0) return res.send({ msg: "No seller is found" });
            res.send(sellerInfo);
        } catch (err) {
            console.log(err.message);
            logger.error(err.message);
            res.send(err.message);
        }
    },
    createBrand: async (req, res) => {
        let isValid = createSchema.validate(req.body);
        if (isValid.error) return res.send(isValid.error);
        try {
            const prod = await brand.findOne({
                seller_id: req.body.seller_id,
                brand_name: req.body.brand_name,
            });
            if (prod)
                return res.send({
                    msg: "This brand name is already created with this seller id",
                });
            else {
                const uploadedResponse = await cloudinary.uploader.upload(
                    req.body.image,
                    {
                        upload_preset: "21genx_brands",
                    }
                );
                const brandData = new brand({
                    seller_id: req.body.seller_id,
                    brand_name: req.body.brand_name,
                    brand_logo_url: uploadedResponse.secure_url,
                    brand_logo_url_public_id: uploadedResponse.public_id,
                    brand_desc: req.body.brand_desc,
                });
                brandData
                    .save()
                    .then((result) => {
                        if (result) {
                            res.send({ msg: "Your brand has been added", added_entry: result });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        logger.error(err.message);
                        res.send(err.message);
                    });
            }
        } catch (err) {
            console.log(err.message);
            logger.error(err.message);
            res.send(err.message);
        }
    },

    updateBrandById: async (req, res) => {
        let isValid = updateSchema.validate(req.body);
        if (isValid.error) return res.send(isValid.error);
        let id = req.body._id;
        let brand_logo_url = req.body.brand_logo_url;
        let brand_desc = req.body.brand_desc;

        if (!brand_logo_url && !brand_desc)
            return res.send({ msg: "Please enter brand logo url or brand description" });
        try {
            const brandToUpdate = await brand.findById(id);
            if (!brandToUpdate) {
                return res.status(404).send({ msg: "This id doesn't exist" });
            }

            // Delete the existing image from Cloudinary if a new image is provided
            if (brand_logo_url) {
                await cloudinary.uploader.destroy(brandToUpdate.brand_logo_url_public_id);
            }

            if (brand_logo_url && brand_desc) {
                const uploadedResponse = await cloudinary.uploader.upload(brand_logo_url, {
                    upload_preset: "21genx_brands",
                });

                let result = await brand.updateOne(
                    { _id: id },
                    {
                        brand_logo_url: uploadedResponse.secure_url,
                        brand_logo_url_public_id: uploadedResponse.public_id,
                        brand_desc: brand_desc,
                    }
                );
                return res.send({ msg: "Your brand is updated" });
            } else {
                if (brand_logo_url) {
                    const uploadedResponse = await cloudinary.uploader.upload(brand_logo_url, {
                        upload_preset: "21genx_brands",
                    });

                    let result = await brand.updateOne(
                        { _id: id },
                        {
                            brand_logo_url: uploadedResponse.secure_url,
                            brand_logo_url_public_id: uploadedResponse.public_id,
                        }
                    );
                    return res.send({ msg: "Your brand is updated" });
                }

                if (brand_desc) {
                    let result = await brand.updateOne(
                        { _id: id },
                        { brand_desc: brand_desc }
                    );
                    return res.send({ msg: "Your brand is updated" });
                }
            }
        } catch (err) {
            console.log(err.message);
            logger.error(err.message);
            res.send(err.message);
        }
    },
    deleteBrand: async (req, res) => {
        let id = req.body._id;
        if (!id) return res.send("Please enter your object Id");
        try {
            const brandToDelete = await brand.findById(id);
            if (!brandToDelete) {
                return res.status(404).send({ msg: "This id doesn't exist" });
            }

            // Delete the image from Cloudinary
            await cloudinary.uploader.destroy(brandToDelete.brand_logo_url_public_id);

            let result = await brand.deleteMany({ _id: id });

            if (result.deletedCount == 0) return res.send({ msg: "This id doesn't exist" });
            res.send({ msg: "Your brand is deleted successfully" });
        } catch (err) {
            console.log(err.message);
            logger.error(err.message);
            res.send(err.message);
        }
    }
};
