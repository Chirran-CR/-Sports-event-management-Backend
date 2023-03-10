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
moderatorRouter
    .route("/update")
    .post(moderatorUpdate);
moderatorRouter
    .route("/remove")
    .post(removeModerator)

async function removeModerator(req,res){
    try{
        const isModeratorPres=await moderatorCollection.find({email:req.body.email});
        if(isModeratorPres.length>0){
            const moderatorDeleteRes=await moderatorCollection.findOneAndDelete({email:req.body.email});
            console.log("Val of moderatorDeleteRes after delete is:",moderatorDeleteRes);
            res.send({
                message:"Moderator deleted from moderator db successfully",
                moderatorDeleteRes:moderatorDeleteRes,
                errorPresent:false,
            })
        }else{
            console.log("Moderator is not present, in the removeModerator fn of mdoerator router");
            res.send({
                message:"Error in removeModerator fn of moderatorRouter,Moderator is not present",
                errorDetails:err,
                errorPresent:true,
            })
        }
    }catch(err){
        console.log("Error in removeModerator fn of moderatorRouter:",err);
        res.send({
            message:"Error in removeModerator fn of moderatorRouter",
            errorDetails:err,
            errorPresent:true,
        })
    }
}

async function moderatorUpdate(req,res){
    try{
        //todo- first check the new email is already present or not, if present set error
        //todo- if not present then find the data of old email and remove it and then add the new moderator
        const emailPresentRes=await moderatorCollection.find({email:req.body.email});
        if(emailPresentRes.length > 0){
            console.log("Email is already present, response from moderatorUpdate")
            res.send({
                message:"Error in moderatorUpdate fn of moderatorRouter, email is already present",
                errorDetails:err,
                errorPresent:true,
            })
        }else{
            const oldModeratorDetailsRes=await moderatorCollection.findOneAndDelete({email:req.body.oldEmail});
            console.log("Val of oldModeratorDetailsRes after delete is:",oldModeratorDetailsRes);
           
            const moderatorObj={
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                eventId:req.body.singleEvent._id,
                selectedSport:req.body.sport
            }
            
            const moderatorDetailsAfterUpdate=await moderatorCollection.create(moderatorObj);
            res.send({
                message:"Moderator is added to moderator database..",
                moderatorDetailsAfterUpdate:moderatorDetailsAfterUpdate,
                errorPresent:false
            })

        }
    }catch(err){
        console.log("Error in moderatorUpdate fn of moderatorRouter:",err);
        res.send({
            message:"Error in moderatorUpdate fn of moderatorRouter",
            errorDetails:err,
            errorPresent:true,
        })
    }
}

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