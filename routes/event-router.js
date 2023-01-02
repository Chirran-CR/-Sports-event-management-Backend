const express=require("express");
const jsonwebtoken=require("jsonwebtoken");

const eventRouter=express.Router();
const eventCollection=require("../model/event-model");
const jsonSecretKey=process.env.JSON_SECRET_KEY;

eventRouter
  .route("/")
  .get(getAllEvents)
eventRouter
  .route("/add")
  .post(protectedRouter,addEvent)
eventRouter
  .route("/update/:id")
  .patch(protectedRouter,updateEvent)
eventRouter
  .route("/delete/:id")
  .delete(protectedRouter,deleteEvent)


function protectedRouter(req,res,next){
   console.log("inside protected Router");
   //here check whether the cookies contain the jwt token and if contain then only proceed
   const teacherCookie=req.cookies?.isTeacherLogin;
   console.log("teacher cookie ki value:",teacherCookie);
   if(teacherCookie){
       const isVerified=jsonwebtoken.verify(teacherCookie,jsonSecretKey);
       console.log("value of isVerified:",isVerified);//value of isVerified: { teacherId: '637b628e61ec9902cfc7da18', iat: 1669140050 }
       if(isVerified){
          console.log("Teacher is authenticated..");
          next();
       }else{
         console.log("Teacher authentication failed..");
         res.send({
            message:"You should login again(as cookie has been deleted).."
         })
       }
   }else{
    console.log("Teacher cookie not found");
    res.send({
        message:"You should login first(teacher cookie not found)"
    })
   }
}

async function getAllEvents(req,res){
    try{
        // console.log("get all events here ",req);
        const allEvents=await eventCollection.find({});
        res.send({
            message:"Obtained all the events",
            allEventsDetails:allEvents
        })
    }catch(err){
        console.log("Error in getAllEvents function..",err);
        res.send({
            message:"error in getAlluser function",
            errorDetails:err.message
        })
    }

}

async function addEvent(req,res){
   try{
        const receivedEvent=req.body;
        const addedEvent=await eventCollection.create(receivedEvent);
        res.send({
             message:"Event added successfully..",
             addedEventDetails:addedEvent
        })
   }catch(err){
    console.log("Error in addEvent fn:",err);
    res.send({
        message:"Error in addEvent fn",
        errorDetails:err
    })
   }
}

async function deleteEvent(req,res){
    try{
        const eventId=req.params.id;
        const deletedDoc=await eventCollection.deleteOne({_id:eventId});
        res.send({
            message:"Event deleted successfully..",
            updatedEvent:deletedDoc
        })
    }catch(err){
        console.log("Error in deleteEvent fn.");
        res.send({
            message:"error in deleteEvent fn",
            errorDetails:err.message
        })
    }
}

async function updateEvent(req,res){
    try{
        const updatedData=req.body;
        const eventId=req.params.id;
        console.log("event id is:",eventId);
        const updatedDoc=await eventCollection.updateOne({_id:eventId},updatedData,{new:true});
        res.send({
            message:"Event updated successfully..",
            updatedEvent:updatedDoc
        })
    }catch(err){
        console.log("Error in updateEvent fn.");
        res.send({
            message:"error in updateEvent fn",
            errorDetails:err.message
        })
    }
}

module.exports=eventRouter;