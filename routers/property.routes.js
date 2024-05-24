const express = require("express");
const {addProperty,updateProperty,getAllProperty,getOneProperty} = require("../controllers/property.controller");
const router = express.Router();
const {addPropertyAndAdValidation,updatePropertyAndAdValidation} = require("../validation/propertyAndAd.validation");
const {jwtdeception} = require("../util/jwt");
const {authorization} = require("../middleware/auth.middleware");




/**
 * @swagger
 * /property/addProperty:
 *   post:
 *     summary: Create a property request
 *     description: Allows clients to create property requests.
 *     tags: [Property Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyType:
 *                 type: string
 *                 enum: [VILLA, HOUSE, LAND, APARTMENT]
 *                 description: Type of property requested
 *               area:
 *                 type: string
 *                 description: Area of the property
 *               price:
 *                 type: number
 *                 description: Price range of the property
 *               city:
 *                 type: string
 *                 description: City of the property
 *               district:
 *                 type: string
 *                 description: District of the property
 *               description:
 *                 type: string
 *                 description: Description of the property
 *     responses:
 *       200:
 *         description: Property request created successfully
 *       401:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router
  .route("/addProperty")
  .post(
    jwtdeception,
    authorization(["ADMIN", "CLIENT"]),
    addPropertyAndAdValidation,
    addProperty
  );


  router
  .route("/updateProperty/:id")
  .patch(
    jwtdeception,
    authorization(["ADMIN","CLIENT"]),
    updatePropertyAndAdValidation,
    updateProperty
  );

  router
  .route("/getAllProperty")
  .get(
    jwtdeception,
    getAllProperty
  );

  router
  .route("/getOneProperty/:id")
  .get(
    jwtdeception,
    getOneProperty
  );


module.exports = router;
