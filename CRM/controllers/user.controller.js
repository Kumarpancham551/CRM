/**
 * This is the controller file for the user resources
 */
const User = require("../models/user.model");
const constant = require("../util/constant");
const objectConverter = require("../util/objectConverter");

exports.findAll = async (req,res) =>{
  const queryObj = {}; // Reading the optional query params

  const userTypeQP =req.query.userType;
  const userStatusQP = req.query.userStatus;
  if(userStatusQP){
   queryObj.userStatus = userStatusQP;
  }
  if(userTypeQP){
    queryObj.userType = userTypeQP;
  }
 try{
   const users = await User.find(queryObj);

   res.status(200).send(objectConverter.userResponse(users));
 }catch(err){
    console.log("Error while fatching all the users");
    res.status(500).send({
        message:"Internal server error"
    })
 }
}

exports.findByUserId = async(req,res)=>{

  try{
    const user = await User.find({userId:req.params.id});
     // user validtion would have happen in  the middleware itself
     return res.status(200).send(objectConverter.userResponse(user));
  
  }catch(err){
    console.log("Error while fatching  the users");
    res.status(500).send({
        message:"Internal server error"
    })
  }
}

exports.update = async(req,res)=>{
  try{
 const user = await User.findOne({userId:req.params.id});
 const isAdmin = await User.findOne({userId:req.userId})
 user.name = req.body.name ? req.body.name:user.name;
 if(isAdmin.userType !== constant.userTypes.admin && (req.body.userType || req.body.userStatus)){
   return res.status(500).send({
    message:"Only admin can change these fields"
   })
 }
 user.userType = req.body.userType ? req.body.userType:user.userType;
 user.userStatus = req.body.userStatus ? req.body.userStatus:user.userStatus;
 
 const updatedUser  = await user.save();
 res.status(200).send({
    name:updatedUser.name,
    userId:updatedUser.userId,
    email:updatedUser.email,
    userType:updatedUser.userType,
    userStatus:updatedUser.userStatus,
 })
  }catch(err){
    console.log("Error while DB operation",err.message)
    return res.status(500).send({
      message:"Internal server error"
    })
  }
}