const env = require("dotenv");
const connectDB = require("./config/db");
const express = require("express");
const productRouter = require("./routes/products");
const userRouter = require("./routes/users");
const orderRouter = require("./routes/orders");
const adminRouter = require("./routes/admin");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

env.config();
connectDB();

const app = express();

//Middleware to enable JSON parser for incoming POST requests
app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin", adminRouter);
app.get("/api/config/paypal", (req, res) =>
  res.status(200).json(process.env.PAYPAL_CLIENT_KEY)
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("<marquee>Serve is up and running</marquee>");
  });
}

// Middleware to handle non-existing routes as well as generic errors
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () =>
  console.log(
    `Server is running on ${process.env.PORT} in ${process.env.NODE_ENV} mode`
      .yellow.bold
  )
);
