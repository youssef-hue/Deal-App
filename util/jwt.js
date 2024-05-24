const jwt = require('jsonwebtoken');
require('dotenv').config()
const User = require('../models/user.model');
const ApiError = require("../util/ApiError.js");

exports.jwtdeception = async (req, res, next) => {
    try{
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.JWTKEY, { algorithms: ["HS256"] });
        const existingUser = await User.findById(decodedToken.userId);
        if(!existingUser){
            return next(new ApiError("User Not Found", 401));
        }
        req.user=existingUser
        next()
    }catch(e){
        return next(new ApiError(e.message, 401));
    }
}

exports.jwtencrement=(id) => {
    try {
        // Assuming you have a secret key for signing the token
        const secretKey = process.env.JWTKEY;

        // Generate the JWT token
        const token = jwt.sign({ userId: id }, secretKey); // Assuming token expires in 1 hour

        return token;
    } catch (error) {
        console.error('Error generating JWT token:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}
