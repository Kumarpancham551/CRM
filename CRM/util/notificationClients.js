/**
 *  This file should have the logic to connect to the notification service
 */
const serverConfig = require("../config/server.config");

const Client = require("node-rest-client").Client;

const client = new Client(); // This is the clent object which will be used for calling the rest API

/**
 * EXposing the methods which takes the request parametrs for sending the 
 * notification request to th enotification service
 */
module.exports = (subject, content, recepients, requester) => {
    /**
     * create the request body
     */
    const reqBody = {
        subject: subject,
        recepientEmails: recepients,
        content: content,
        requester: requester
    }
    /**
     * Preapare the headrs
     */
    const reqHeadrer = {
        "Content-Type": "application/json"
    }

    /**
     * Combine headers and req body together
     */
    const args = {
        data: reqBody,
        headers: reqHeadrer
    }
    /**
     * Make  a POST call and handel the response
     * 
     *  URI should go in the .env file
     */
    try {
        client.post(serverConfig.URI, args, (data, res) => {
            console.log("Request Sent");
            console.log(data);
        })
    } catch (err) {
        console.log("err is : ",err);
    }
}