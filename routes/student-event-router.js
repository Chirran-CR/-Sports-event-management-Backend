const express=require("express");
const jsonwebtoken=require("jsonwebtoken");

const studentEventRouter=express.Router();
const studentEventCollection=require("../model/student-event-model");
const jsonSecretKey=process.env.JSON_SECRET_KEY;

studentEventRouter
  .route("/:id")
  .get(protectedRouter,getAllParticipatingEvents)
studentEventRouter
  .route("/add")
  .post(protectedRouter,addParticipatingEvent)

let studentId;
function protectedRouter(req,res,next){
   console.log("inside protected Router");
   //here check whether the cookies contain the jwt token and if contain then only proceed
   const studentCookie=req.cookies?.isStudentLogin;
   console.log("student cookie ki value:",studentCookie);
   if(studentCookie){
       const isVerified=jsonwebtoken.verify(studentCookie,jsonSecretKey);
       console.log("value of isVerified:",isVerified);//value of isVerified: { teacherId: '637b628e61ec9902cfc7da18', iat: 1669140050 }
       if(isVerified){
          studentId=isVerified.studentId;
          console.log("Student is authenticated..");
          next();
       }else{
         console.log("Student authentication failed..");
         res.send({
            message:"You should login again(as cookie has been deleted).."
         })
       }
   }else{
    console.log("Student cookie not found");
    res.send({
        message:"You should login first(Student cookie not found)"
    })
   }
}

async function getAllParticipatingEvents(req,res){
    try{
        const studId=req.params.id;
        const allParticipatingEvents=await studentEventCollection.find({studentId:studId});
        res.send({
            message:"Obtained all the events",
            allEventsDetails:allParticipatingEvents
        })
    }catch(err){
        console.log("Error in getAllParticipatingEvents function..",err);
        res.send({
            message:"error in getAllParticipatingEvents function",
            errorDetails:err.message
        })
    }

}

async function addParticipatingEvent(req,res){
   try{
        const receivedData=req.body;
        const afterAddingStudentId={...receivedData,studentId:studentId};
        const eventDoc=await studentEventCollection.create(afterAddingStudentId);
        res.send({
             message:"Event added successfully..",
             addedEventDetails:eventDoc
        })
   }catch(err){
    console.log("Error in addParticipatingEvent fn:",err);
    res.send({
        message:"Error in addParticipatingEvent fn",
        errorDetails:err
    })
   }
}


module.exports=studentEventRouter;