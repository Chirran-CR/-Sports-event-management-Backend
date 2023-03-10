const express = require("express");


const userRouter = express.Router();
const userCollection=require("../model/user-model");

userRouter
    .route("/add")
    .post(addUser);
userRouter
    .route("/get")
    .post(getUser);
userRouter
    .route("/remove")
    .post(removeUser);


async function removeUser(req,res){
    try{
        const userDeleteRes=await userCollection.findOneAndDelete({email:req.body.email});
        console.log("Val of userDeleteRes after delete is:",userDeleteRes);
        res.send({
            message:"user deleted from user db successfully",
            userDeleteRes:userDeleteRes,
            errorPresent:false,
        })
    }catch(err){
        console.log("Error in removeUser fn of userRouter:",err);
        res.send({
            message:"Error in removeUser fn of userRouter",
            errorDetails:err
        })
    }
}

async function addUser(req,res){
    console.log("Req.body received is:",req.body);
    const userObj={
        name:req.body.name,
        email:req.body.email,
        designation:req.body.designation,
    }
    try{
        const userDetails=await userCollection.create(userObj);
        res.send({
            message:"User is added to the userDatabase",
            userDetails:userDetails,
        })
    }catch(err){
        console.log("Error in addUser fn of userRouter:",err);
        res.send({
            message:"Error in addUser fn of userRouter",
            errorDetails:err
        })
    }
}

async function getUser(req,res){
   console.log("Val of req.body is:",req.body);
   try{
       const userDetails=await userCollection.find({email:req.body.email});
       console.log("Val of userDetails is:",userDetails);
       
       res.send({
        message:"Request is received..",
        userDetails:userDetails,
      })
   }catch(err){
    console.log("Error in getUser fn of userRouter:",err);
    res.send({
        message:"Error in getUser fn of userRouter",
        errorDetails:err
    })
   }
}


module.exports=userRouter;