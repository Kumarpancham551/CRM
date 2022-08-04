/**
 * Route logic for the ticket ressources
 */
const ticketController = require("../controllers/ticket.controller");
const {authJwt,verifyTicket} = require("../middleware");

module.exports = (app)=>{

    /**
     * create a ticket 
     * 
     * Assignment: Add the middleware for the request body
     */

    app.post("/crm/api/v1/tickets",[authJwt.verifyToken],ticketController.createTicket);

    /**
     * GET/crm/api/v1/tickets
     */

     app.get("/crm/api/v1/tickets",[authJwt.verifyToken,],ticketController.getAll);

     /**
      * PUT/crm/api/v1/tickets/:id
      */
    app.put("/crm/api/v1/tickets/:id",[authJwt.verifyToken,verifyTicket.isValidOwnerofTheTicket],ticketController.updateTicket);
}
