const express = require("express");


const moderatorRouter = express.Router();
const moderatorCollection=require("../model/moderator-model");

moderatorRouter
    .route("/add")
    .post(addModerator);
moderatorRouter
    .route("/get")
    .get(getModerator);
moderatorRouter
    .route("/get")
    .post(getSingleModerator);
moderatorRouter
    .route("/login")
    .post(moderatorLogin);

async function moderatorLogin(req,res){
    try{
       const email=req.body.email;
       const psd=req.body.password;
       const moderatorRes= await moderatorCollection.find({email:email});
       if(moderatorRes.length>0){
            //match the psd
            if(moderatorRes[0].password == psd){
                res.send({
                    message:"Login successful for moderator",
                    errorPresent:false,
                    moderatorDetails:moderatorRes[0]
                })
            }else{
                res.send({
                    message:"Invalid credentials",
                    errorPresent:true,
                })
            }
       }else{
          res.send({
            message:"You are not a valid user, first register yourself",
            errorPresent:true,
          })
       }
    }catch(err){
        console.log("Error in moderatorLogin fn of moderatorRouter:",err);
        res.send({
            message:"Error in moderatorLogin fn of moderatorRouter",
            errorDetails:err,
            errorPresent:true,
        })
    }
}   


async function getSingleModerator(req,res){
    try{
        const moderatorDetails=await moderatorCollection.find({email:req.body.email});
        res.send({
            message:"Moderator is sent to login page..",
            moderatorDetails:moderatorDetails[0],
        })
    }catch(err){
        console.log("Error in getSingleModerator fn of moderatorRouter:",err);
        res.send({
            message:"Error in getSingleModerator fn of moderatorRouter",
            errorDetails:err
        })
    }
}
async function addModerator(req,res){
    console.log("Req.body received is:",req.body);
    const moderatorObj={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        eventId:req.body.singleEvent._id,
        selectedSport:req.body.sport
    }
    try{
        const moderatorDetails=await moderatorCollection.create(moderatorObj);
        res.send({
            message:"Moderator is added to moderator database..",
            moderatorDetails:moderatorDetails,
        })
    }catch(err){
        console.log("Error in addModerator fn of moderatorRouter:",err);
        res.send({
            message:"Error in addModerator fn of moderatorRouter",
            errorDetails:err
        })
    }
}

async function getModerator(req,res){
   console.log("Val of req.body is:",req.body);
   try{
       const moderatorDetails=await moderatorCollection.find({});
       console.log("Val of moderatorDetails is:",moderatorDetails);
       
       res.send({
        message:"Moderator details has been sent",
        moderatorDetails:moderatorDetails,
      })
   }catch(err){
    console.log("Error in getModerator fn of moderatorRouter:",err);
    res.send({
        message:"Error in getModerator fn of moderatorRouter",
        errorDetails:err
    })
   }
}


module.exports=moderatorRouter;