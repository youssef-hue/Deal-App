const User = require('../models/user.model.js');
const Property = require('../models/property.model.js');
const Ad = require('../models/ad.model.js');
const handler = require('../util/handler.js');
const ApiError = require("../util/ApiError.js");
const mongoose = require('mongoose');

// // // // // // // // // // // // // // // // // User // // // // // // // // // // // // 

exports.login = handler.Login(User);

exports.addUser = handler.createOne(User);

exports.adminBlockUser = async (req, res, next) => {
    try {
        const id = req.params.id
        const userData = await User.findById(id)
        'ACTIVE', 'DELETED'
        if(userData.role==="ADMIN"){
            return next(new ApiError("Admin Can't Block Admin", 401));
        }
        if(userData.status==="ACTIVE"){
            userData.status="DELETED"
        }else{
            userData.status="ACTIVE"
        }
        userData.save()
        // Response
        res.status(200).json({
            success: true,
            message: "Blocked Successfully",
        });
    } catch (err) {
        return next(new ApiError(err.massage, 400));
    }
};
exports.getOneUser = handler.getOne(User);

exports.getallUser = handler.getAll(User);

exports.getUserStats = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const options = {
      page,
      limit
    };

    const users = await User.paginate({}, options);

    if (!users || users.docs.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    const stats = [];
    for (const user of users.docs) {
      const adsStats = await Ad.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(user._id) } },
        {
          $group: {
            _id: null,
            adsCount: { $sum: 1 },
            totalAdsAmount: { $sum: "$price" },
          },
        },
      ]);

      const requestsStats = await Property.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(user._id) } },
        {
          $group: {
            _id: null,
            requestsCount: { $sum: 1 },
            totalRequestsAmount: { $sum: "$price" },
          },
        },
      ]);

      const adsCount = adsStats[0] ? adsStats[0].adsCount : 0;
      const totalAdsAmount = adsStats[0] ? adsStats[0].totalAdsAmount : 0;
      const requestsCount = requestsStats[0] ? requestsStats[0].requestsCount : 0;
      const totalRequestsAmount = requestsStats[0] ? requestsStats[0].totalRequestsAmount : 0;

      stats.push({
        name: user.name,
        role: user.role,
        adsCount,
        totalAdsAmount,
        requestsCount,
        totalRequestsAmount,
      });
    }

    res.json({
      data: stats,
      page: users.page,
      limit: users.limit,
      total: users.totalDocs,
      hasNextPage: users.hasNextPage,
      hasPreviousPage: users.hasPrevPage,
    });
  } catch (error) {
    next(error);
  }
};