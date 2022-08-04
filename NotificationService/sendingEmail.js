/**
 * This file will contain the sample code for sending the emails notifications
 */
// app password is --  qmacvxckkirocitc

const nodemailer = require("nodemailer");

const transpoter = nodemailer.createTransport({
    port: 465,    // true for 465, false for other port
    host:"smtp.gmail.com",
    auth:{
        user: "panchamku8873@gmail.com",
        pass: "qmacvxckkirocitc"
    },
    secure: true
});

console.log(typeof transpoter);

/**
 * Sending email
 */
const mailDataObj = {
    from:"crm-no-replay@gmail.com",
    to:"panchamku8873@gmail.com",
    subject:"Testing the code to send email",
    text:"Sample text content",
    html:"<b> Hello world ! </b>"
}
transpoter.sendMail(mailDataObj,(err,data)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log("mail sent");
    }
})