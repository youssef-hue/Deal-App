const mongoose = require('mongoose');
const { USER_TYPES } = require("../util/constant");
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
      
    },
    phone: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: USER_TYPES
    },
    status: {
        type: String,
        default: 'ACTIVE',
        enum: ['ACTIVE', 'DELETED']
    }
}, { timestamps: true }
);
userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", userSchema);
