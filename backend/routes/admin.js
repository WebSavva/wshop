const express = require("express");
const {
  registerNewUser,
  getUsers,
  deleteUser,
  editUser,
  getUserById,
} = require("./../controllers/userController");
const {
  deleteProduct,
  updateProduct,
  createProduct,
  getAllProducts,
} = require("./../controllers/productController");
const {
  deleteOrder,
  getOrders,
  getOrderById,
  deliverOrderById,
} = require("./../controllers/orderController");
const {
  authorizeUser,
  authorizeAdmin,
} = require("./../middleware/authorizationMiddleware");

const router = express.Router();

router
  .route("/users/:id")
  .delete(authorizeUser, authorizeAdmin, deleteUser)
  .put(authorizeUser, authorizeAdmin, editUser)
  .get(authorizeUser, authorizeAdmin, getUserById);
router
  .route("/users")
  .get(authorizeUser, authorizeAdmin, getUsers)
  .post(authorizeUser, authorizeAdmin, registerNewUser);

router
  .route("/products/:id")
  .delete(authorizeUser, authorizeAdmin, deleteProduct)
  .put(authorizeUser, authorizeAdmin, updateProduct);
router
  .route("/products")
  .post(authorizeUser, authorizeAdmin, createProduct)
  .get(authorizeUser, authorizeAdmin, getAllProducts);

router.route("/orders").get(authorizeUser, authorizeAdmin, getOrders);
router
  .route("/orders/:id")
  .delete(authorizeUser, authorizeAdmin, deleteOrder)
  .get(authorizeUser, authorizeAdmin, getOrderById);
router
  .route("/orders/:id/deliver")
  .put(authorizeUser, authorizeAdmin, deliverOrderById);

module.exports = router;
