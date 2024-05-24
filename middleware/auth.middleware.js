const ApiError = require("../util/ApiError.js");

exports.authorization = (name) => {
  return async (req, res, next) => {
    try {
      if(req.user.status==="DELETED"){
        return next(new ApiError("You Are Blocked By Admin", 401));
      }
      // Check if the user's role includes the required role
        if (!name.includes(req.user.role)) {
            return next(new ApiError("You Have No Permission", 401));
        }
        // If the user's role includes the required role, proceed to the next middleware
        next();
    } catch (error) {
        // Pass error to error handler middleware
        return next(new ApiError(error.message, 401));
    }
  };
};