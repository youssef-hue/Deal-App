const ApiError = require("../util/ApiError");
require("dotenv").config({ path: "./config/dev.env" });

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    success: err.success || false,
    message: err.message || "Something went wrong",
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  if (err.statusCode?.toString()?.startsWith("5")) {
    res.status(err.statusCode).json({
      success: false,
      message: "Something went wrong",
    });
  } else {
    // For other status codes
    res.status(err.statusCode).json({
      success: err.success || false,
      message: err.message || "Something went wrong",
    });
  }
};

const handleInvalidJwtSignature = (_) =>
  new ApiError("Invalid token, Please login again ...", 401);

const handleJwtExpired = (_) =>
  new ApiError("Expired token, Please login again ...", 401);

const globalError = (err, req, res, next) => {
  err.success = err.success || false;
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleInvalidJwtSignature();
    if (err.name === "TokenExpiredError") err = handleJwtExpired();
    sendErrorForProd(err, res);
  }
};

module.exports = globalError;