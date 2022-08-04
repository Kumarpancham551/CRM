/** Starting point of the aplication */

const express = require('express');
const app = express();
const serverConfig = require('./config/server.config');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Ticket = require("./models/ticket.model");
const bcrypt = require("bcryptjs");


/**Register the body parser middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


/**
 * Intitialize the connection to the mongoDm
 */
 mongoose.connect(serverConfig.DB_URL);
 const db = mongoose.connection;
 db.on("error",()=>{
    console.log("Error while connecting to MongoDB");
 });
 db.once("open",()=>{
    console.log("Connected to mongoDB");
    init();
 })
/**
 * create the ADMIN user at the boot time
 */
async function init(){
    /**Check if the user admin is alredy present */
try{
    await User.collection.drop(); // This line drop the collection every time so tha t line 37 to 42 is not required
    await Ticket.collection.drop();
   /* let  user = await User.findOne({userId:"admin"});
    if(user){
        console.log("Admin is already present");
        return;
    } */
   const  user =  await User.create({
        name:"Vishwa",
        userId:"admin",
        password:"Welcome1",
        email:"kankvishwa@gmail.com",
        password:bcrypt.hashSync("Welcome1",8),
        userType:"ADMIN"
    })
    
    console.log(user);
}catch(err){
    console.log("error in admin creation ", err.message);
}
}



/**
 * We need to connect router to the server
 */
require("./routes/auth.route")(app); //this registers server with the route
require("./routes/user.route")(app); 
require("./routes/ticket.rout")(app);
app.listen(serverConfig.PORT, ()=>{
    console.log("Started the server on the port number : " ,serverConfig.PORT)
})