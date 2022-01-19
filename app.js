require("dotenv").config();
// auto-handles async errors
require("express-async-errors");
// express setup
const express = require("express");
const app = express();
// database
const connectDB = require("./db/connect");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleWare = require("./middleware/error-handler");

// routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reivewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

// extra packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");

// setting express middlewares
app.use(express.json()); // parses json data in requests and sets it at req.body
app.use(express.static("./public")); // routes static file requests to the provided path

// express rate limiter config
app.set("trust proxy", 1);

// limits number of requests made by specific ips
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
// adds extra headers to make API request secure
app.use(helmet());
// makes server accessible through other domains
app.use(cors());
// cleans the req and res objects to prevent csrf attacks
app.use(xss());
// sanitizes mongo query objects to prevent injection attacks
app.use(mongoSanitize());

// setting third-party middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
}
app.use(cookieParser(process.env.SIGNED_COOKIE_SECRET));
app.use(fileUpload());

// setting routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reivewRouter);
app.use("/api/v1/orders", orderRouter);

app.get("/", (req, res) => {
  res.send("E-commerce API");
});

// setting custom error-handler middleware
// order is important
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleWare);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
