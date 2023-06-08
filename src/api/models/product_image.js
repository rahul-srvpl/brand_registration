const mongoose = require('mongoose');
mongoose.pluralize(null);

const imageSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Types.ObjectId, required: true, unique: true,
        ref: "products",
    },
    main_img: { type: String },
    img_2: { type: String },
    img_3: { type: String },
    img_4: { type: String },
    img_5: { type: String },
    img_6: { type: String },
    img_7: { type: String },
    img_8: { type: String },
    main_img_public_id: { type: String },
    img_2_public_id: { type: String },
    img_3_public_id: { type: String },
    img_4_public_id: { type: String },
    img_5_public_id: { type: String },
    img_6_public_id: { type: String },
    img_7_public_id: { type: String },
    img_8_public_id: { type: String }
}, { timestamps: true, toJSON: { getters: true }, strict: false });

const ProductImage = mongoose.model('product_images', imageSchema);
module.exports = ProductImage;

