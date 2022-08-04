const mongoose = require("mongoose");
const constant = require("../util/constant");

const ticketSchema = new mongoose.Schema({
  title:{
    type : String,
    required : true
  },
  ticketPriority:{
    type : Number,
    required : true,
    default : 4
  },
  description:{
    type : String,
    required : true
  },
  status:{
    type : String,
    required : true,
    default:constant.ticketStatus.open,
    enum : [constant.ticketStatus.open,constant.ticketStatus.close,constant.ticketStatus.blocked]
  },
  reporter:{
    type : String,
    required : true
  },
  assignee:{
    type : String
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
},{versionKey:false})// this will ensure _v is not created by mongoose

module.exports = mongoose.model("Ticket",ticketSchema);