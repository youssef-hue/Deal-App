const express = require("express");
const morgan = require("morgan");
var cors = require("cors");
const compression = require("compression");
const path = require("path");
require("dotenv").config({ path: "./config/dev.env" });
require("./util/dbConnection");
const globalError =  require("./middleware/error.middleware")
// const Country = require('./models/Country.js');
const ApiError = require("./util/ApiError.js");
const swaggerSetup = require('./util/swagger.js');

const user = require("./routers/user.routes.js");
const property = require("./routers/property.routes.js");
const ad = require("./routers/ad.routes.js");

const cron = require('node-cron');
const Property = require('./models/property.model');

// Define a function to refresh property requests
async function refreshPropertyRequests() {
    try {
        await Property.updateMany({}, { refreshedAt: Date.now() });
        console.log('Property requests refreshed successfully.');
    } catch (error) {
        console.error('Error refreshing property requests:', error);
    }
}
const app = express();

const port = process.env.PORT;
swaggerSetup(app);
cron.schedule('0 0 */3 * *', () => {
  refreshPropertyRequests();
});

app.listen(port, () => {
  console.log(`Mode: ${process.env.NODE_ENV}`);
  console.log(`Server on port ${port}`);
});
  // Middlewares
app.use(cors());
app.options("*", cors());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json({ limit: "25kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "uploads")));
// Routes
app.use("/user", user);
app.use("/property", property);
app.use("/ad", ad);
// Not Found Route
app.all("*", (req, res, next) => {
  next(new ApiError(`This Route (${req.originalUrl}) is not found`, 404));
});
// Global Error Handler
app.use(globalError);

module.exports = app;