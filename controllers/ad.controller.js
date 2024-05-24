const Ad = require('../models/ad.model.js');
const Property = require('../models/property.model.js');
const handler = require('../util/handler.js');

// // // // // // // // // // // // // // // // // Ad // // // // // // // // // // // // 

exports.addAd = handler.createOne(Ad);
exports.updateAd = handler.updateOne(Ad);
exports.getOneAd = handler.getOne(Ad,{
    path: "user",
    model: "User",
    select:"-password",
});
exports.getAllAd = handler.getAll(Ad,{
    path: "user",
    model: "User",
    select:"-password",
});

exports.matchRequestsWithAd = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;
  
      const ad = await Ad.findById(id);
      if (!ad) {
        return res.status(404).json({ message: 'Ad not found' });
      }
  
      const priceTolerance = 0.1 * ad.price; // 10% tolerance
  
      const matchPipeline = [
        {
          $match: {
            district: { $regex: new RegExp(ad.district, 'i') },
            area: { $regex: new RegExp(ad.area, 'i') }, // Case-insensitive matching
            price: {
              $gte: ad.price - priceTolerance,
              $lte: ad.price + priceTolerance,
            },
          },
        },
        {
            $lookup: {
              from: 'users', // Ensure this matches the name of your users collection
              localField: 'user',
              foreignField: '_id',
              as: 'user'
            },
          },
          {
            $unwind: '$user'
          },
          {
            $project: {
              'user.password': 0, // Exclude the password field
              // Project other fields as needed
            },
          },
        {
            $sort: { refreshedAt: -1 },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: parseInt(limit, 10),
        },
      ];
  
      const matchedRequests = await Property.aggregate(matchPipeline);
      const totalRequests = await Property.countDocuments({
        district: ad.district,
        area: { $regex: new RegExp(ad.area, 'i') }, // Case-insensitive matching
        price: {
          $gte: ad.price - priceTolerance,
          $lte: ad.price + priceTolerance,
        },
      });
  
      res.json({
        data: matchedRequests,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total: totalRequests,
        hasNextPage: page * limit < totalRequests,
        hasPreviousPage: page > 1,
      });
    } catch (error) {
      next(error);
    }
  };