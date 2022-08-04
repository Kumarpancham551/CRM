
validateRequestBody =  (req,res,next)=>{
    if(!req.body.subject){
        return res.status(400).send({
            message:"Subject is not provided"
        })
    }
    if(!req.body.recepientEmails){
        return res.status(400).send({
            message:" recepientEmails  is not provided"
        })
    }
   
    if(!req.body.content){
        return res.status(400).send({
            message:"Email content is not provided"
        })
    }
    if(!req.body.requester){
        return res.status(400).send({
            message:"Please provided requester detail"
        })
    }
   
     next();
    }


    module.exports = validateRequestBody;