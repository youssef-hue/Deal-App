const asyncHandler = require("express-async-handler");
const ApiError = require("../util/ApiError");
const ApiFeatures = require("../util/ApiFeatures");
const {jwtencrement} = require('../util/jwt.js')
const bcrypt = require('bcrypt');
exports.Login = (model) =>
  asyncHandler(async (req, res, next) => {
    
  const existingUser = await model.findOne({ phone: req.body.phone});
  if (!existingUser) {
    return next(new ApiError("Email not found.", 400));
  }
  const validPassword = await bcrypt.compare(req.body.password, existingUser.password);
  if (!validPassword) {
    return next(new ApiError("Wrong Password", 400));
  }
  if(existingUser.status==="DELETED"){
    return next(new ApiError("You Are Blocked By Admin", 400));
  }
  const token = await jwtencrement(existingUser._id)
  existingUser.password=undefined
    res.status(200).json({
      success: true,
      Authorization: token,
      data: existingUser,
    });
  });

  exports.deleteOne = (model) =>
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const document = await model.findById(id);
      if (!document)
        return next(new ApiError(`${model.modelName} is not found`, 404));
      const removed = await document.deleteOne();
      if (!removed)
        return next(
          new ApiError(
            `Error occurred while deleting the ${model.modelName.toLowerCase()}`,
            400
          )
        );
      res.status(200).json({
        success: true,
      });
    });
  
  exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
      const updated = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!updated)
        return next(new ApiError(`${model.modelName} is not found`, 404));
      res.status(200).json({
        success: true,
        data: updated,
      });
    });
  
  exports.createOne = (model) =>
    asyncHandler(async (req, res) => {
      const newDocument = await model.create(req.body);
      newDocument.password=undefined
      res.status(201).json({
        success: true,
        data: newDocument.toJSON(),
      });
    });
  
  exports.getOne = (model, populationOpt) =>
    asyncHandler(async (req, res, next) => {
      let id=req.params.id
      console.log("🚀 ~ asyncHandler ~ id:", id)
      // Query
      let query = model.findById(id);
      // In user model remove password value
      if (model.modelName === "User") query = query.select("-password");
      // Population
      if (populationOpt) query = query.populate(populationOpt);
      // Api Features
      const apiFeatures = new ApiFeatures(query, req.query)
        .limitFields()
        .mongooseQueryExec();
      // Execute the query
      let doc = await apiFeatures.mongooseQuery;
      // Check if the item exists
      doc = doc[0].toJSON();
      if (!doc) return next(new ApiError(`${model.modelName} is not found`, 404));
      // Response
      res.status(200).json({
        success: true,
        data: doc,
      });
    });
  
  exports.getAll = (model,populationOpt) =>
    asyncHandler(async (req, res) => {
      console.log("🚀 ~ populationOpt:", populationOpt)
  
      // Filter Object
      let filter = {};
      if (req.filterObj) filter = req.filterObj;
      // ApiFeatures instance
      const apiFeatures = new ApiFeatures(model.find(filter).populate(populationOpt).select('-password'), req.query)
        .limitFields()
        .sort();
      // Clone apiFeatures to get documents count after filterations
      const clonedApiFeatures = apiFeatures.clone().mongooseQueryExec();
      const docsCount = await clonedApiFeatures.mongooseQuery.countDocuments();
      // Paginate filtered documents
      apiFeatures.pagination(docsCount).mongooseQueryExec();
      // Fetch data
      const { mongooseQuery, paginationResult } = apiFeatures;
      let docs = await mongooseQuery;
      // Response
      res.status(200).json({
        success: true,
        results: docsCount,
        paginationResult,
        data: docs,
      });
    });
  