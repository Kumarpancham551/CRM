/**
 * This file will contain the logic for routing request
 * 
 * This file is dedicated to the routing logic for signup and sign in
 */

const authController = require("../controllers/auth.controllers");
const {verifySignUp} = require("../middleware");

module.exports = (app)=>{
    app.post("/crm/api/v1/auth/signup",[verifySignUp.validateSignUpRequestBody],authController.signup);

    // LOGIN

    app.post("/crm/api/v1/auth/signin",[verifySignUp.validateSigninRequestBody],authController.signin);
}