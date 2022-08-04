const verifySignUp = require("./verifySignUp");
const authJwt = require("./authJWT");
const verifyTicket = require("./ticketvalidator")

module.exports = {
    verifySignUp,
    authJwt,
    verifyTicket
}