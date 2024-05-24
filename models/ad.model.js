const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    area: {
        type: String,
        required: true
      
    },
    price: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    propertyType: {
        type: String,
        required: true,
        enum: ["VILLA", "HOUSE", "LAND", "APARTMENT"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
}, { timestamps: true }
);
module.exports = mongoose.model("Ad", adSchema);
