const express = require("express");
const teacherCollection = require("../model/teacher-model");


const teacherRouter = express.Router();
// const userCollection=require("../model/user-model");

// studentRouter
//     .route("/add")
//     .post(addUser);
teacherRouter
    .route("/get")
    .get(getTeachers);

// async function addUser(req,res){
//     console.log("Req.body received is:",req.body);
//     const userObj={
//         name:req.body.name,
//         email:req.body.email,
//         designation:req.body.designation,
//     }
//     try{
//         const userDetails=await userCollection.create(userObj);
//         res.send({
//             message:"User is added to the userDatabase",
//             userDetails:userDetails,
//         })
//     }catch(err){
//         console.log("Error in addUser fn of userRouter:",err);
//         res.send({
//             message:"Error in addUser fn of userRouter",
//             errorDetails:err
//         })
//     }
// }

async function getTeachers(req,res){
   console.log("Val of req.body is:",req.body);
   try{
       const teachersDetails=await teacherCollection.find({});
       console.log("Val of teachersDetails is:",teachersDetails);
       
       res.send({
        message:"Request is received..",
        teachersDetails:teachersDetails,
      })
   }catch(err){
    console.log("Error in getTeachers fn of teacherRouter:",err);
    res.send({
        message:"Error in getTeachers fn of teacherRouter",
        errorDetails:err
    })
   }
}


module.exports=teacherRouter;