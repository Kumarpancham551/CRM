/**
 * here we are going to have the logic to schedule the sending of the email
 */

const cron = require("node-cron");
const Notification = require("../models/notification.model");
const constant = require("../utils/constant")
const emailTransporter = require("../notifiers/emailService")

cron.schedule("*/10 * * * * *",async ()=>{
   /**
    * write the logic to read from the db and send email
    */

   /**
    * Fetch all the notification requests which are UN_SENT status
    */
    const notifications = await Notification.find({status:constant.status.un_sent})
   /**
    * send the email notification corresponding to each of those request 
    */
  if(notifications){
    console.log("Number of unsent requests are :", notifications.length);
    /**
     * sent the email for each single notification request
     */
    notifications.forEach(n =>{
        const mailObj = {
                to:n.recepientEmails,
                subject:n.subject,
                text : n.content
        }
        emailTransporter.sendMail(mailObj,async (err,info)=>{
            if(err){
                console.log("Error while sending email ", err.message);
            }else{
                console.log("Successfully sent the email ",info);

                /**
                 * I need to go and update the status of the notification
                 */
                n.status = constant.status.sent;
                await n.save();
            }
        })
    })
  }

})