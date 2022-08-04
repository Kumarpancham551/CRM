// Define the schema for the notification model

const mongoose = require("mongoose");
const constants = require("../utils/constant")

const notificationSchema = new mongoose.Schema({
    subject:{
        type:String,
        required:true
    },
    recepientEmails:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    requester:{
        type:String
    },
    status:{
        type:String,
        default:constants.status.un_sent,
        enum:[constants.status.un_sent,constants.status.sent]
    },
    createdAt:{
        type:Date,
        immutable:true,
        default:()=>{
            return Date.now();
        }
    },
    updateAt:{
        type:Date,
        default:()=>{
            return Date.now();
        }
    }
})

module.exports = mongoose.model("notification",notificationSchema);