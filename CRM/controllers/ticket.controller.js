/**
 * This file should have the logic to create controller for ticket resources
 */

/**
 * Method to create the logic of creating tickets
 * 
 * 1. Any authenticated user should be able to  create the ticket   -- Middleware should take care of this
 * 
 * 
 * 2. Ensure that request body has valid data -- middleware should take care of this 
 * 
 * 
 * 3. After the ticket is created, ensure the customer and engineer documents also updated 
 * 
 * 4. Send the email after the ticket is created to all the stack holders
 */
const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const constants = require("../util/constant");
const  sendNotificationReq = require("../util/notificationClients");

exports.createTicket = async (req,res)=>{
    try{
    // Read the request body and create the ticket object
   const ticketObj = {
    title:req.body.title,
    ticketPriority:req.body.ticketPriority,
    description:req.body.description,
    status:req.body.status,
    reporter:req.userId // I got it from access token
   }
 
    //Find the Engineer available and attached to the ticket object .

// Assignment:-Extends this to choose the engineer which has lease number of tickets assign
const AllEngineer = await User.find({
    userType:constants.userTypes.engineer,
    userStatus:constants.userStatus.approved
})
let engineer = AllEngineer[0];
AllEngineer.forEach(eng=>{
if(eng.ticketAssigned.length<engineer.ticketAssigned.length){
    
    engineer = eng;

}
});
if(engineer){
    ticketObj.assignee = engineer.userId;
}

    // Insert the ticket object - insert that ticket id in customer and engineer document

    const ticketCreated = await Ticket.create(ticketObj);
    if(ticketCreated){
        //Update the customer documents 
            const customer = await User.findOne({
                userId:req.userId
            })
           
        customer.ticketsCreated.push(ticketCreated._id);
        await customer.save();
        // Updates the engineer documents
        if(engineer){
            engineer.ticketAssigned.push(ticketCreated._id);
            await engineer.save();
        }

        // Now we should send the notification request to notificationService
        sendNotificationReq(`Ticket created with id :  ${ticketCreated._id}`,"Your Incident is created" , `${customer.email} , ${engineer.email}, kankvishwa@gmail.com`, "CRM App")
        res.status(201).send(ticketCreated);
    }

}catch(err){
    console.log("error while doing the db operations ", err.message);
    return res.status(500).send({
        message:"Internal server error"
    })
}

}

/**
 * Getting all the tickets
 */

exports.getAll = async (req,res)=>{

    /**
     * We need to find the userType and depending on the user type we need to frame the search queery 
     */
    const user = await User.findOne({userId:req.userId});
    const queryObj = {};
    const ticketCreated =  user.ticketsCreated; // this is an array of ticket_id
    const ticketAssigned =  user.ticketAssigned;
    if(user.userType == constants.userTypes.customer){
        /**
         * Query for fetching all the tickets created by the user
         */
       
        if(!ticketCreated){
            return res.status(403).send({
                message:"No tickets created by this user"
            })
        };

        queryObj["_id"] = {$in : ticketCreated};
        console.log("queryObject is  ",queryObj);

    }else if(user.userType == constants.userTypes.engineer){
        /**
         * Query for fetching all the objects assined/created by me
         */
    
       

        queryObj["$or"] = [{"_id":{$in : ticketCreated} }, {"_id": {$in : ticketAssigned}}] 
        console.log("queryObject in engineer -> ",queryObj);
    }
    const tickets = await Ticket.find(queryObj);

    res.status(200).send(tickets);

}
/**
 * Write the controller function to take care of updates
 */


exports.updateTicket = async (req, res) => {

    try {

        const ticket = await Ticket.findOne({ "_id": req.params.id });

        /**
         * Update this ticket object based on the request body
         * passed
         */

        ticket.title = req.body.title != undefined ? req.body.title : ticket.title;
        ticket.description = req.body.description != undefined ? req.body.description : ticket.description;
        ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority : ticket.ticketPriority;
        ticket.status = req.body.status != undefined ? req.body.status : ticket.status;
        ticket.assignee = req.body.assignee != undefined ? req.body.assignee : ticket.assignee;


        const updatedTicket = await ticket.save();

        res.status(200).send(updatedTicket);
    
    } catch (err) {
        console.log("Some error while updating ticket ", err.message);
        res.status(500).send({
            message: "Some internal error while updating the ticket"
        })
    }
}
