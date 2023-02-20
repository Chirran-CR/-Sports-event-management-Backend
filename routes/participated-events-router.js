//was used before modifying database

const express=require("express");
const jsonwebtoken=require("jsonwebtoken");

const participatedEventRouter=express.Router();
const participatedEventCollection=require("../model/participated-events-model");
const jsonSecretKey=process.env.JSON_SECRET_KEY;

participatedEventRouter
  .route("/:id")
  .get(getAllParticipatingEvents)
participatedEventRouter
  .route("/add")
  .post(addParticipatingEvent)

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
        // const allParticipatingEvents=await participatedEventCollection.find({participatedEvent:{$elemMatch:{"studentId":studId}}});
        const allParticipatingEvents=await participatedEventCollection.find({studentId:studId});
       
        res.send({
            message:"Obtained all the events for the asked student",
            participatedEventsDetails:allParticipatingEvents
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
        const eventData=req.body.myEvents;//single evetns ka obj
        // const afterAddingStudentId={...receivedData,studentId:studentId};
        // const eventDoc=await studentEventCollection.create(afterAddingStudentId);
       const alreadyPresentStudent=await participatedEventCollection.find({participatedEvent:{$elemMatch:{"studentId":studentId}}});
       console.log("value of already present student:",alreadyPresentStudent);
  
       if(alreadyPresentStudent.length>0){
            const newParticipatedData={...alreadyPresentStudent,myEvents:[...alreadyPresentStudent.myEvents,eventData]};
            console.log("newParticipatedData ki value in participated-event-router:",newParticipatedData);
            const participatedDataDoc=await participatedEventCollection.create(newParticipatedData);
            console.log("participatedDataDoc ki value:",participatedDataDoc);
            res.send({
                message:"Student Participated in an event successfully and event details added",
                participatedDataDoc:participatedDataDoc
            })
        }else{
            console.log("req ki body",req.body);
            const afterAddingStudentId={...req.body,studentId:studentId};
            console.log("afterAddingStudentId ki value:",afterAddingStudentId);
            const newParticipatedDoc=new participatedEventCollection({...afterAddingStudentId});
            const savedData=await newParticipatedDoc.save();
        //   const newParticipatedDoc=await participatedEventCollection.create(afterAddingStudentId);
          console.log("newParticipatedDoc ki value:",newParticipatedDoc);
          console.log("savedData:",savedData);
          res.send({
            message:"new Student added(participated) in an event successfully",
            participatedDataDoc:savedData            
          })
       }
   }catch(err){
    console.log("Error in addParticipatingEvent fn of participated-event-router:",err);
    res.send({
        message:"Error in addParticipatingEvent fn of participated-event-router",
        errorDetails:err
    })
   }
}


module.exports=participatedEventRouter;