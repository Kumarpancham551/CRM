const express = require("express");
const bodyparser = require("body-parser");
const serverConfig = require("./configs/server.config")
const mongoose = require("mongoose");

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : true}));
/**
 * Intitializing the DB connection
 */
mongoose.connect(serverConfig.DB_URL,()=>{
    console.log("Connected to mongodb")
},
err =>{
    console.log("Some error occured", err.message)
})

/**
 * switch the router to server.js
 */
require("./routes/notification.route")(app);

/**
 * attached the cron file also
 */
require("./schedulars/emailSchedular");

app.listen(serverConfig.PORT, ()=>{
    console.log("Server started",serverConfig.PORT);
})