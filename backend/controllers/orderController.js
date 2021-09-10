const asyncHandler = require("express-async-handler");
const Order = require("./../models/orderModel");
const Product = require("./../models/productModel");
const generateUserJWT = require("./../utils/generateUserJWT");
const { ObjectId } = require("mongoose");

// @desc creates new order for the authenticated user
// @method POST api/orders/
// @access PRIVATE
const createNewOrder = asyncHandler(async (req, res) => {
  const newRequestedOrder = req.body;
  try {
    for (let orderItem of newRequestedOrder.orderItems) {
      const orderedProduct = await Product.findById(orderItem.product);
      if (orderedProduct.stockInCount < orderItem.qty) {
        res.status(404).json({
          message:
            "Some of products in your cart are not available now. Please, recollect you cart.",
        });
        return;
      } else {
        orderedProduct.stockInCount -= orderItem.qty;
        await orderedProduct.save();
      }
    }

    const newOrder = await Order.create(newRequestedOrder);
    res.status(201).json(newOrder.toClient());
  } catch (error) {
    res.status(404).json({
      message: "Your order has not been saved. Try again !",
    });
  }
});

// @desc  send user order by id
// @method GET api/orders/:id
// @access PRIVATE
const getOrderById = asyncHandler(async (req, res) => {
  const requestedOrderId = req.params.id;
  try {
    const requestedOrder = await Order.findById(requestedOrderId).populate(
      "user"
    );

    if (requestedOrder.user) {
      const orderOwner = requestedOrder.user.toString();
      if (orderOwner !== req.user.id && !req.user.isAdmin)
        res.status(403).json({
          message: "You are permitted to see the details of the given order",
        });
      requestedOrder.user = requestedOrder.user.toClient();
    }

    res.status(200).json(requestedOrder.toClient());
  } catch (error) {
    res.status(404).json({
      message: "There is no such order!",
    });
  }
});

// @desc  delete order
// @method DELETE api/orders/:id
// @access PRIVATE/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const requestedOrderId = req.params.id;
  try {
    await Order.deleteOne({
      _id: requestedOrderId,
    });

    res.status(200).json(true);
  } catch (error) {
    res.status(404).json({
      message: "There is no such order!",
    });
  }
});

// @desc  get all user orders
// @method GET api/orders/
// @access PRIVATE
const getOrders = asyncHandler(async (req, res) => {
  try {
    const requestedOrders = await Order.find({
      ...(!req.user.isAdmin && { user: req.user.id }),
    });
    res.status(200).json(requestedOrders.map((order) => order.toClient()));
  } catch (error) {
    res.status(404).json({
      message: "Invalid user id",
    });
  }
});

// @desc  pay a certain order by id
// @method POST api/orders/:id/pay
// @access PRIVATE
const payOrderById = asyncHandler(async (req, res) => {
  const requestedOrderId = req.params.id;
  const paymentResult = req.body;
  try {
    const requestedOrder = await Order.findById(requestedOrderId);
    const orderOwner = requestedOrder.user.toString();

    if (orderOwner !== req.user.id && !req.user.isAdmin)
      res.status(403).json({
        message: "You are permitted to see the details of the given order",
      });

    requestedOrder.isPaid = true;
    requestedOrder.paidAt = new Date();
    requestedOrder.paymentResult = {
      id: req.body.id,
      email: req.body.payer.email_address,
      status: req.body.status,
      update_time: req.body.update_time,
    };
    await requestedOrder.save();

    res.status(200).json(true);
  } catch (error) {
    res.status(404).json({
      message: "There is no such order or something went wrong!",
    });
  }
});

// @desc  change delivery status of order by id
// @method POST api/orders/:id/pay
// @access PRIVATE/Admin
const deliverOrderById = asyncHandler(async (req, res) => {
  const requestedOrderId = req.params.id;
  try {
    const requestedOrder = await Order.findById(requestedOrderId);
    const orderOwner = requestedOrder.user.toString();

    requestedOrder.isDelivered = true;
    requestedOrder.deliveredAt = new Date();
    await requestedOrder.save();

    res.status(200).json(true);
  } catch (error) {
    res.status(404).json({
      message: "There is no such order or something went wrong!",
    });
  }
});

module.exports = {
  createNewOrder,
  getOrderById,
  payOrderById,
  getOrders,
  deleteOrder,
  deliverOrderById,
};
