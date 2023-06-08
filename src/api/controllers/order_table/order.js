const orderModel = require("../../models/order_table");
const { v4: uuidv4 } = require("uuid");

// Generate an order ID
function generateOrderID() {
  const uniqueID = uuidv4().split("-").join("").toUpperCase();
  const timestamp = Date.now().toString();
  const randomNumber = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  const orderID = `${uniqueID}${timestamp}${randomNumber}`.slice(0, 20);
  return orderID;
}

exports.createOrder = (req, res) => {
  try {
    const {
      orderDate,
      orderStatus,
      userId,
      totatlProduct,
      amount,
      orderItems,
      shipingAddress,
      billingAddress,
      paymentMethod,
      payment,
      voucher,
      sellerDetails,
    } = req.body;
    const orderId = generateOrderID();
    const newOrder = new orderModel({
      orderId,
      orderDate,
      orderStatus,
      userId,
      amount,
      totatlProduct,
      orderItems,
      shipingAddress,
      billingAddress,
      paymentMethod,
      payment,
      voucher,
      sellerDetails,
    });
    newOrder.save().then((data) => {
      const successMessage = "Order placed";
      logger.info(successMessage);
      console.log(successMessage); // Console log

      res.status(200).send({ msg: successMessage, data: data });
    });
  } catch (error) {
    const errorMessage = "Failed to create order";
    logger.error(errorMessage, error);
    console.log(errorMessage, error); // Console log

    res.status(202).send({ error: error });
  }
};

exports.get_all_orders = (req, res) => {
  try {
    const { orderStatus, payment } = req.body;
    const { page, limit } = req.query;

    const matchFilters = {};

    if (orderStatus && orderStatus.length > 0) {
      matchFilters.orderStatus = { $in: orderStatus };
    }

    if (payment && payment.length > 0) {
      matchFilters.payment = { $in: payment };
    }

    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;

    orderModel
      .aggregate([
        {
          $lookup: {
            from: "products",
            localField: "orderItems",
            foreignField: "_id",
            as: "orderItems",
          },
        },
        {
          $lookup: {
            from: "user_addresses",
            localField: "shippingAddress",
            foreignField: "_id",
            as: "shippingAddress",
          },
        },
        {
          $lookup: {
            from: "user_addresses",
            localField: "billingAddress",
            foreignField: "_id",
            as: "billingAddress",
          },
        },
        {
          $lookup: {
            from: "sellers",
            localField: "sellerDetails",
            foreignField: "_id",
            as: "seller_details",
          },
        },
        {
          $lookup: {
            from: "coupons",
            localField: "voucher",
            foreignField: "_id",
            as: "voucher",
          },
        },
        {
          $match: matchFilters,
        },
        {
          $skip: (pageNumber - 1) * pageSize,
        },
        {
          $limit: pageSize,
        },
      ])
      .then((data) => {
        const successMessage = "Retrieved all orders";
        logger.info(successMessage);
        console.log(successMessage); // Console log

        res.status(200).send({ msg: successMessage, data: data });
      });
  } catch (error) {
    const errorMessage = "Unable to get orders";
    logger.error(errorMessage, error);
    console.log(errorMessage, error); // Console log

    res.status(500).send({ error: error });
  }
};

exports.get_order_with_id = (req, res) => {
  try {
    const id = req.params.id;
    orderModel
      .aggregate([
        {
          $match: {
            $expr: {
              $eq: [{ $toString: "$_id" }, id],
            },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems",
            foreignField: "_id",
            as: "orderItems",
          },
        },
        {
          $lookup: {
            from: "user_addresses",
            localField: "shipingAddress",
            foreignField: "_id",
            as: "shippingAddress",
          },
        },
        {
          $lookup: {
            from: "user_addresses",
            localField: "billingAddress",
            foreignField: "_id",
            as: "billingAddress",
          },
        },
        {
          $lookup: {
            from: "sellers",
            localField: "sellerDetails",
            foreignField: "_id",
            as: "seller_details",
          },
        },
        {
          $lookup: {
            from: "coupons",
            localField: "voucher",
            foreignField: "_id",
            as: "voucher",
          },
        },
      ])
      .then((data) => {
        const successMessage = "Retrieved order by ID";
        logger.info(successMessage);
        console.log(successMessage); // Console log

        res.status(200).send({ msg: successMessage, data: data });
      });
  } catch (error) {
    const errorMessage = "Unable to get order by ID";
    logger.error(errorMessage, error);
    console.log(errorMessage, error); // Console log

    res.status(500).send({ error: error });
  }
};

exports.delete_order = (req, res) => {
  try {
    const id = req.params.id;
    orderModel.findByIdAndDelete(id).then((data) => {
      const successMessage = "Order data deleted successfully";
      logger.info(successMessage);
      console.log(successMessage); // Console log

      res.status(202).send({ msg: successMessage });
    });
  } catch (error) {
    const errorMessage = "Unable to delete order";
    logger.error(errorMessage, error);
    console.log(errorMessage, error); // Console log

    res.status(500).send({ error: error });
  }
};

exports.search_Order = async (req, res) => {
  try {
    await orderModel
      .aggregate([
        {
          $match: {
            $and: [
              {
                $or: [
                  {
                    orderId: {
                      $regex: req.body.orderId,
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          $project: {
            __v: 0,
            createdAt: 0,
            updateAt: 0,
          },
        },
      ])
      .then((data) => {
        console.log("data", data);
        const successMessage = "Order search successful";
        logger.info(successMessage);
        console.log(successMessage); // Console log

        res.status(200).json({
          status: true,
          message: successMessage,
          data: data,
        });
      });
  } catch (error) {
    const errorMessage = "Invalid ID. Server error.";
    logger.error(errorMessage, error);
    console.log(errorMessage, error); // Console log

    res.status(500).json({
      status: false,
      message: errorMessage,
      error: error,
    });
  }
};
