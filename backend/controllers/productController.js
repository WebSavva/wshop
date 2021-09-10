const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

// @desc route to extract all available products from database
// @method GET api/products?search={}&page={}
// @access PUBLIC
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 5;
  const { search: searchValue, page: currentPageNumber = 1 } = req.query;

  const productQuery = searchValue
    ? {
        name: {
          $regex: searchValue,
          $options: "i",
        },
      }
    : {};

  const productsNumber = await Product.countDocuments(productQuery);
  const productsData = await Product.find(productQuery)
    .populate("reviews.user", "_id name")
    .limit(pageSize)
    .skip(pageSize * (currentPageNumber - 1));

  res.status(200).json({
    productsData: productsData.map((product) => product.toClient()),
    currentPageNumber,
    pagesNumber: Math.ceil(productsNumber / pageSize),
  });
});

// @desc get the highest rated products
// @method GET api/products/top
// @method PUBLIC
const getTopProducts = asyncHandler(async (req, res) => {
  const topProducts = await Product.find({})
    .populate("reviews.user", "_id name")
    .sort({ rating: -1 })
    .limit(3);
  res.status(200).json(topProducts.map((product) => product.toClient()));
});

// @desc get all products data for admin
// @method GET api/admin/products
// @method PRIVATE/Admin
const getAllProducts = asyncHandler(async (req, res) => {
  const productsData = await Product.find({}).populate(
    "reviews.user",
    "_id name"
  );

  res.status(200).json(productsData.map((product) => product.toClient()));
});

// @desc route to retrieve a product by id from database
// @method GET api/products/:id
// @access PUBLIC
const getProductById = asyncHandler(async (req, res) => {
  const productData = await Product.findById(req.params.id).populate(
    "reviews.user",
    "_id name"
  );

  if (productData) {
    res.status(200).json(productData.toClient());
  } else {
    res.status(404).json({
      message: "Such product does not exist",
    });
  }
});

// @desc delete product by id
// @method DELETE api/admin/products/:id
// @access PRIVATE/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const productData = await Product.deleteOne({
    _id: req.params.id,
  });

  if (productData) {
    res.status(200).json(true);
  } else {
    res.status(404).json({
      message: "Such product does not exist",
    });
  }
});

// @desc update product information
// @method PUT api/admin/products/:id
// @access PRIVATE/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const requestedProductId = req.params.id;
  const newProductData = req.body;

  const productData = await Product.findById(req.params.id);

  if (productData) {
    for (let [propName, propValue] of Object.entries(req.body)) {
      productData[propName] = propValue;
    }

    await productData.save();

    res.status(200).json(productData);
  } else {
    res.status(404).json({
      message: "Such product does not exist",
    });
  }
});

// @desc update product information
// @method POST api/admin/products/
// @access PRIVATE/Admin
const createProduct = asyncHandler(async (req, res) => {
  const newProductData = req.body;
  newProductData.user = req.user.id;
  const productData = await Product.create(newProductData);

  res.status(200).json(productData);
});

// @desc add new review
// @method POST api/products/:id/reviews
// @access PRIVATE
const createReview = asyncHandler(async (req, res) => {
  const newReview = req.body;
  const productId = req.params.id;
  let requestedProduct;
  try {
    requestedProduct = await Product.findById(productId);
  } catch {
    res.status(400).json({
      message: "No product found",
    });
  }

  newReview.user = req.user.id;

  if (!Array.isArray(requestedProduct.reviews)) {
    requestedProduct.reviews = [];
  }

  requestedProduct.reviews.push(newReview);
  requestedProduct.rating = (
    requestedProduct.reviews.reduce((ac, review) => ac + review.rating, 0) /
    requestedProduct.reviews.length
  ).toFixed(1);
  requestedProduct.reviewsNumber = requestedProduct.reviews.length;

  try {
    await requestedProduct.save();
    res.status(201).json(true);
  } catch (error) {
    res.status(404).json({
      message: "Your review has not been saved",
    });
  }
});

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  createReview,
  getAllProducts,
  getTopProducts,
};
