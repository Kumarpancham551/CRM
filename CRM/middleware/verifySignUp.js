/**
 This file will have the logic to validate the incomming request
 */
const User = require("../models/user.model");
const constants = require("../util/constant");

validateSignUpRequestBody = async (req,res,next)=>{
    // validate if name is present
    if(!req.body.name){
        return res.status(400).send({
            message:"Failed! user name is not provided"
        })
    }
    //validate if the userId is present and it's  not duplicate
    if(!req.body.userId){
        return res.status(400).send({
            message:"Failed!  userId is not provided"
        })
    }
    try{
        const user = await User.findOne({userId:req.body.userId})
        if(user != null){
            return res.status(400).send({
                message:"Failed!  userId is already taken"
            })
        }
    }catch(err){
        return res.status(400).send({
            message:"Internal Error while validaing the request"
        })
    }

    
    // validate the password is present or not
   
    if(!req.body.password){
        return res.status(400).send({
            message:"Failed! user password is not provided"
        })
    }

    // validate if the email is present, is valid and not duplicate
   
    if(!req.body.email){
        return res.status(400).send({
            message:"Failed! user email is not provided"
        })
    } 
    if(!isValidEmail(req.body.email)){
        return res.status(400).send({
            message:"Failed! provided email is valid formate "
        }) 
    }
    //validate if the userType is present and valid
    if(!req.body.userType){
        return res.status(400).send({
            message:"Failed! userType is not provided"
        })
    } 

     if(req.body.userType == constants.userTypes.admin){
        return res.status(400).send({
            message:"Admin registration is not allowed"
        })
     }
    const userTypes = [constants.userTypes.customer,constants.userTypes.engineer];
    
    if(!userTypes.includes(req.body.userType)){
        
            return res.status(400).send({
                message:"userType provided is not correct. Possible values are  : CUSTOMER and ENGINEER"
            })
      
    }
   
    next();
}
 
const isValidEmail = (email) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}   

validateSigninRequestBody = (req,res,next)=>{
    if(!req.body.userId){
        return res.status(400).send({
            message:"Failed!  userId is not provided"
        })
    }
    if(!req.body.password){
        return res.status(400).send({
            message:"Failed! user password is not provided"
        })
    }
    next();
}

const verifyRequestBodiesForauth ={
    validateSignUpRequestBody:validateSignUpRequestBody,
    validateSigninRequestBody:validateSigninRequestBody
}
module.exports = verifyRequestBodiesForauth;