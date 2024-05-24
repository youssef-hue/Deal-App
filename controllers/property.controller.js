const Property = require('../models/property.model.js');
const handler = require('../util/handler.js');

// // // // // // // // // // // // // // // // // Property // // // // // // // // // // // // 

exports.addProperty = handler.createOne(Property);
exports.updateProperty = handler.updateOne(Property);
exports.getAllProperty = handler.getAll(Property,{
    path: "user",
    model: "User",
    select:"-password",
});
exports.getOneProperty = handler.getOne(Property,{
    path: "user",
    model: "User",
    select:"-password",
});