const express = require("express");
const { authorizeUser } = require("./../middleware/authorizationMiddleware");
const {
  createNewOrder,
  getOrderById,
  payOrderById,
  getOrders,
} = require("../controllers/orderController");

const ordersRouter = express.Router();

ordersRouter
  .route("/")
  .post(authorizeUser, createNewOrder)
  .get(authorizeUser, getOrders);
ordersRouter.get("/:id", authorizeUser, getOrderById);
ordersRouter.route("/:id/pay").post(authorizeUser, payOrderById);

module.exports = ordersRouter;
