const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");
const User = require("../models/user.model");
const constants= require("../util/constant");


const verifyToken = (req,res,next)=>{


let token = req.headers["x-access-token"];
     
    /**
     * Check if the token is provided or not
     */
    if(!token){
        return res.status(401).send({
            message :"No token provided"
        })
    }

    /**
     * Go and validate the token
     */
    jwt.verify(token,authConfig.secret,(err,decoded)=>{
        if(err){
            return res.status(401).send({
                message :"Unauthorized"
            })
        }
        req.userId = decoded.id;
        next();
    })
   
    /**
     * read the value pof the token userid and set in the request for further used
     */
}
 const isAdmin = async (req,res,next)=> {
   const user = await User.findOne({userId:req.userId})
   if(user && user.userType == constants.userTypes.admin){
    next();
   }else{
    res.status(403).send({
        message:"Only ADMIN users are allowed to access this endpoint"
    })
   }
 }

 const isValidUserIdInReqParam = async (req,res,next)=>{
    try{
     const user = await User.find({userId:req.params.id});
     if(!user){
      return  res.status(400).send({
            message:"User id doesn't exist"
        })
     }
     next();
    }catch(err){
        console.log("Error while reading the user Info ",err.message);
        res.send(500).send({
            message:"Internal server error while reading the user`"
        })
    }
 }
 const isAdminOrOwner = async(req,res,next)=>{
  // Either the caller should be the admin or caller should be the owner
  try{
   const callingUser = await User.findOne({userId:req.userId});
   if(callingUser.userType == constants.userTypes.admin || callingUser.userId == req.params.id){
    next();
   }else{
    res.status(403).send({
        message:"Only admin or owner is allowed to make this call"
    })
   }
   }catch(err){
       console.log("Error while reading the user Info ",err.message);
       res.send(500).send({
           message:"Internal server error while reading the user`"
       })
   }

 }
 
 const authJwt= {
    verifyToken:verifyToken,
    isAdmin:isAdmin,
    isValidUserIdInReqParam:isValidUserIdInReqParam,
    isAdminOrOwner:isAdminOrOwner
}
module.exports =  authJwt