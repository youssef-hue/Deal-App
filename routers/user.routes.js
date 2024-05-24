const express = require("express");
const {addUser,login,adminBlockUser,getOneUser,getallUser,getUserStats} = require("../controllers/user.controller");
const router = express.Router();
const {addUserValidation,loginValidation} = require("../validation/user.validation");
const {jwtdeception} = require("../util/jwt");
const {authorization} = require("../middleware/auth.middleware");

router
  .route("/login")
  .post(
    loginValidation,
    login
  );


  
router
  .route("/addUser")
  .post(
    addUserValidation,
    addUser
  );

router
  .route("/adminBlockUser/:id")
  .patch(
    jwtdeception,
    authorization(["ADMIN"]),
    adminBlockUser
  );
  router
  .route("/getallUser")
  .get(
    jwtdeception,
    authorization(["ADMIN"]),
    getallUser
  );

  router
  .route("/getOneUser/:id")
  .get(
    jwtdeception,
    authorization(["ADMIN"]),
    getOneUser
  );



/**
 * @swagger
 * /user/adminUserStats:
 *   get:
 *     summary: Get admin stats
 *     description: Retrieve statistics about how many ads or requests exist for each user (client or agent) and the total amount of those ads or requests.
 *     tags: [Admin Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       role:
 *                         type: string
 *                       adsCount:
 *                         type: number
 *                       totalAdsAmount:
 *                         type: number
 *                       requestsCount:
 *                         type: number
 *                       totalRequestsAmount:
 *                         type: number
 *                 page:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 total:
 *                   type: number
 *                 hasNextPage:
 *                   type: boolean
 *                 hasPreviousPage:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router
  .route("/adminUserStats")
  .get(
    jwtdeception,
    authorization(["ADMIN"]),
    getUserStats
  );
module.exports = router;
