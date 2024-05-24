const mongoose = require('mongoose');
const { PROPERTY_TYPES } = require("../util/constant");

const propertySchema = new mongoose.Schema({
    area: {
        type: String, // Changed to Number assuming area is numeric
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
        enum:PROPERTY_TYPES
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true // Added required property to link the ad with the user who created it
    },
    refreshedAt: {
      type: Date,
      default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);