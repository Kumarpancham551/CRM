/**
 * This file contain the logic for the registration of the user and login of the user
 * 
 * user types:-
 * 
 * 1.Customer
 *      register and it approved by default
 *      Should be able to login immediately * 
 * 
 * 2. Engineer
 *          Should be able to registered
 *          Intially he/she will be in pending state
 *          Admin should be able to approve this
 * 
 * 3.Admin
 *         Admin user should be created from the backend No api should be supported for it
 */

/**
 * Logic to accept the registration/signup
 */
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");
const constants = require("../util/constant");

exports.signup= async (req,res)=>{
  /**
   * I neeed to read the data from the request body  
   */
     if(req.body.userType !=  constants.userTypes.customer){
        req.body.userStatus = constants.userStatus.pending;
     }
    

  /**
   * Convert that into the js object for inserting in the mongodb
   */
     const userObj={
        name:req.body.name,
        userId:req.body.userId,
        email:req.body.email,
        userType:req.body.userType,
        password:bcrypt.hashSync(req.body.password,8),
        userStatus:req.body.userStatus
     }
  /**
   * Insert the data and return the response
   */
     try{
        const userCreated = await User.create(userObj);
        /**
         * We need to return the newly created user as the response. But we should remove some sensitive feilds
         * 
         *  -password,
         * - -V
         * -- _id
         * 
         * We need to create the custom response and return
         */
         const response = {
            name:userCreated.name,
            userId:userCreated.userId,
            email:userCreated.email,
            userType:userCreated.userType,
            userStatus:userCreated.userStatus,
            createdAt:userCreated.createdAt,
            updatedAt:userCreated.updateAt
         }
        res.status(201).send(response);
     }catch(err){
        console.log("Some error Happend",err.message);
        res.status(500).send({
            message:"Some internal  server error "
        })
     }
 
}

/**
 * Logic for sign in
 */

exports.signin= async (req,res)=>{
/**
 * If the userId passed is correct
 */
try{
  const user = await User.findOne({userId:req.body.userId});
  if(user == null){
    return res.status(400).send({
        message:"Failed ! usserid  doesn't exist"
    });
  }

  /**
   * check if the user is in pending state
   */
   if(user.userStatus == constants.userStatus.pending){
      return res.status(400).send({
         message:"Not yet approved from the admin"
     });
   }

/**
 * If the password passed is correct
 */
 const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
 if(!passwordIsValid){
    return res.status(401).send({
        message:"Wrong password"
    });
 }
/**
 * Create the JWT token
 */
  const token = jwt.sign({
    id:user.userId
  },
  authConfig.secret,{
    expiresIn:600
  }
  )
/**
 * Send the successfull login response
 */
res.status(200).send({
    name:user.name,
    userId:user.userId,
    email:user.email,
    userType:user.userType,
    userStatus:user.userStatus,
    accessToken:token
});
}catch(err){
    console.log("Internal error",err.message);
    res.status(500).send({
        message:"Some Internal error while signin"
    })
}
}