const Joi = require('joi');
const ApiError = require("../util/ApiError.js");
const User = require("../models/user.model.js");
const bcrypt = require('bcrypt');
const { USER_TYPES } = require("../util/constant.js");


exports.loginValidation = async (req, res, next) => {
  try{
      const data= req.body
      const schema = Joi.object({
          phone: Joi.string().required(),
          password: Joi.string().required()
        });
        const { error } = schema.validate(data);
        if (error) return next(new ApiError(error.details[0].message, 400));
        next()
  }catch(e){
      return next(new ApiError(e.message, 400));
  }
}


exports.addUserValidation = async (req, res, next) => {
    try{
        const data= req.body
        console.log("🚀 ~ exports.addUserValidation= ~ data:",USER_TYPES)
        const schema = Joi.object({
            name: Joi.string().required(),
            phone: Joi.string().length(11).required(),
            role: Joi.string().valid(...USER_TYPES).required(),
            password: Joi.string().min(6).required()
          });
          const { error } = schema.validate(data);
          if (error) return next(new ApiError(error.details[0].message, 400));
          const existingUser = await User.findOne({ phone: data.phone });
            if (existingUser) {
            return next(new ApiError("email phone Used", 400));
          }
          req.body.password=await bcrypt.hash(data.password, 10);
          next()
    }catch(e){
        return next(new ApiError(e.message, 400));
    }
}
