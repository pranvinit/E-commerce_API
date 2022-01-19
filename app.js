require("dotenv").config();

// express setup
const express = require("express");
const app = express();

// routers
const authRouter = require("./routes/authRoutes");

// extra packages
const morgan = require("morgan");

// setting routers

app.use("/api/v1/auth", authRouter);

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleWare = require("./middleware/error-handler");

// database
const connectDB = require("./db/connect");

// setting express middlewares
app.use(express.json());

// setting third-party middlewares
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("E-commerce API");
});

// setting custom error-handler middleware
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
