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

// extra packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// setting express middlewares
app.use(express.json());

// setting third-party middlewares
app.use(morgan("tiny"));
app.use(cookieParser(process.env.SIGNED_COOKIE_SECRET));

// setting routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

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
