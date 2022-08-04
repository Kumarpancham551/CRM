const User = require("../models/user.model");
const Ticket = require("../models/ticket.model");
const constants = require("../util/constant");


const isValidOwnerofTheTicket = async (req, res, next) => {
    const user = await User.findOne({ userId: req.userId })

    const ticket = await Ticket.findOne({ _id: req.params.id });
    if (user.userType == constants.userTypes.customer) {
        const ownerId = ticket.reporter;
        if (user.userId != ownerId) {
            return res.status(403).send({
                message: "Only Admin | Owner | Assigned Engineer is allowed to update"
            })
        }

    } else if (user.userId == constants.userTypes.engineer) {
        const ownerID = ticket.reporter;
        const engineerId = ticket.assignee;

        if (user.userId != ownerID && user.userId != engineerId) {

            return res.status(403).send({
                message: "Only Admin | Owner | Assigned Engineer is allowed to update"
            })
        }
    }
    /**
     *  if the update reqiuires the change in th eassignee
     * 
     *  1. Only admin should be allowed to do this
     *  2. Assignee should be a valid Engineer
     */
    if (req.body.assignee != undefined) {

        if (req.body.assignee != ticket.assignee && user.userType != constants.userTypes.admin) {
            return res.status(403).send({
                message: "Only Admin  is allowed to update"
            })
        }
    }

    next();


}

const verifyTicket = {
    isValidOwnerofTheTicket: isValidOwnerofTheTicket
}

module.exports = verifyTicket;