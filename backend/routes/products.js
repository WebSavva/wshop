const express = require("express");
const {
  getProducts,
  getProductById,
  createReview,
  getTopProducts,
} = require("../controllers/productController");
const { authorizeUser } = require("../middleware/authorizationMiddleware");

const productsRouter = express.Router();

productsRouter.get("/", getProducts);
productsRouter.route("/top").get(getTopProducts);

productsRouter.route("/:id").get(getProductById);
productsRouter.post("/:id/reviews", authorizeUser, createReview);

module.exports = productsRouter;
