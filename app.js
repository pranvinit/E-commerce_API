require("dotenv").config();

// express setup
const express = require("express");
const app = express();

// database
const connectDB = require("./db/connect");

// setting express middlewares
app.use(express.json());

app.get("/", (req, res) => {
  res.send("E-commerce API");
});

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
