const express = require("express");
const {addAd,updateAd,getAllAd,getOneAd,matchRequestsWithAd} = require("../controllers/ad.controller.js");
const router = express.Router();
const {addPropertyAndAdValidation,updatePropertyAndAdValidation} = require("../validation/propertyAndAd.validation.js");
const {jwtdeception} = require("../util/jwt");
const {authorization} = require("../middleware/auth.middleware");


  
router
  .route("/addAd")
  .post(
    jwtdeception,
    authorization(["ADMIN","AGENT"]),
    addPropertyAndAdValidation,
    addAd
  );

  router
  .route("/updateAd/:id")
  .patch(
    jwtdeception,
    authorization(["ADMIN","AGENT"]),
    updatePropertyAndAdValidation,
    updateAd
  );

  router
  .route("/getAllAd")
  .get(
    jwtdeception,
    getAllAd
  );

  router
  .route("/getOneAd/:id")
  .get(
    jwtdeception,
    getOneAd
  );

router
  .route("/matchRequestsWithAd/:id")
  .get(
    jwtdeception,
    authorization(["ADMIN", "AGENT"]),
    matchRequestsWithAd
  );

module.exports = router;
