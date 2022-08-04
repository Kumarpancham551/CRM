/**
 * This file will contain the sample code for sending the emails notifications
 */
// app password is --  qmacvxckkirocitc

const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
    port: 465,    // true for 465, false for other port
    host:"smtp.gmail.com",
    auth:{
        user: "panchamku8873@gmail.com",
        pass: "qmacvxckkirocitc"
    },
    secure: true
});
