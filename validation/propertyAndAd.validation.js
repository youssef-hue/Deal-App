const Joi = require('joi');
const ApiError = require("../util/ApiError.js");
const Property = require("../models/property.model.js");
const Ad = require("../models/ad.model.js");
const { PROPERTY_TYPES } = require("../util/constant.js");

exports.addPropertyAndAdValidation = async (req, res, next) => {
    try{
        const data= req.body
        const schema = Joi.object({
          area: Joi.string().required(),
          price: Joi.number().required(),
          city: Joi.string().required(),
          district: Joi.string().required(),
          description: Joi.string().required(),
          propertyType: Joi.string().valid(...PROPERTY_TYPES).required(),
          });
          const { error } = schema.validate(data);
          if (error) return next(new ApiError(error.details[0].message, 400));
          req.body.user=req.user._id
          
          next()
    }catch(e){
        return next(new ApiError(e.message, 400));
    }
}
exports.updatePropertyAndAdValidation = async (req, res, next) => {
  try{
      const data= req.body
      const schema = Joi.object({
        area: Joi.string().required(),
        price: Joi.number().required(),
        city: Joi.any().forbidden(),
        district: Joi.any().forbidden(),
        description: Joi.string().required(),
        propertyType: Joi.any().forbidden(),
      });
        const { error } = schema.validate(data);
        if (error) return next(new ApiError(error.details[0].message, 400));
        req.body.user=req.user._id
        const existProperty = await Property.findById(req.params.id)
        const existAd = await Ad.findById(req.params.id)
        console.log("🚀 ~ exports.updatePropertyAndAdValidation= ~ existAd:", existAd)
        if(existProperty){
          if (req.user._id.toString()!==existProperty.user.toString()){
            return next(new ApiError("you Can't update an Other User Property", 400));
          }
        }else if (existAd){
          if (req.user._id.toString()!==existAd.user.toString()){
            return next(new ApiError("you Can't update an Other User Ad", 400));
          }
        }else{

        }
        next()
  }catch(e){
      return next(new ApiError(e.message, 400));
  }
}
