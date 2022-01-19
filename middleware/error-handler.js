const { StatusCodes } = require("http-status-codes");
// overwrites the default express async error handler

const errorHandlerMiddleWare = (err, req, res, next) => {
  const customError = {
    message: err.message || "Something went wrong try again later",
    statusCode: err.StatusCodes || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  // handling mongoose errors

  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(" ,");
    customError.statusCode = 400;
  }
  if (err.code && err.code == -11000) {
    customError.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  if (err.name === "CastError") {
    customError.message = `No item with id: ${err.value}`;
    customError.statusCode = 404;
  }
  return res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandlerMiddleWare;
