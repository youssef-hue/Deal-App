const mongoose = require("mongoose");

// Connect to the database
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Error connecting to the database" + err);
  });