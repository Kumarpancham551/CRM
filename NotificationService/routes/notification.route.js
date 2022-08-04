const notificationController = require("../controllers/notification.controller")
const validateRequestBody = require("../middleware/reqValidtor");

module.exports = (app)=>{
    /**
     * Insert a new notification request 
     * POST(notiserve/api/v1/notification)
     */
    app.post("/notiserve/api/v1/notifications",[validateRequestBody],notificationController.acceptNotificationRequest);

    /**
     * Get the notification status = if the notification was sent or not
     * 
     */

    app.get("/notiserve/api/v1/notifications/:id",notificationController.getNotificationDetails);
}