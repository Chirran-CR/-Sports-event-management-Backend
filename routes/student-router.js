const express = require("express");
const studentCollection = require("../model/student-model");


const studentRouter = express.Router();
// const userCollection=require("../model/user-model");

// studentRouter
//     .route("/add")
//     .post(addUser);
studentRouter
    .route("/get")
    .get(getStudents);

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

async function getStudents(req,res){
   console.log("Val of req.body is:",req.body);
   try{
       const studentDetails=await studentCollection.find({});
       console.log("Val of studentDetails is:",studentDetails);
       
       res.send({
        message:"Request is received..",
        studentDetails:studentDetails,
      })
   }catch(err){
    console.log("Error in getStudents fn of studentRouter:",err);
    res.send({
        message:"Error in getgetStudents fn of studentRouter",
        errorDetails:err
    })
   }
}


module.exports=studentRouter;