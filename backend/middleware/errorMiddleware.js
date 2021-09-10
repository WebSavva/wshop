const path = require('path');

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.url}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.log(error.message);
  console.log(err.stack);
  res.status(statusCode);
  res.json({
    message: "Something went wrong",
  });
};

module.exports = {
  notFound,
  errorHandler,
};
