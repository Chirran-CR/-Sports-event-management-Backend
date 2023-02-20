const express=require("express");
const jsonwebtoken=require("jsonwebtoken");
const multer=require("multer");
const path=require("path");


const eventRouter=express.Router();
const eventCollection=require("../model/event-model");
const jsonSecretKey=process.env.JSON_SECRET_KEY;
console.log("inside event router");

const storage=multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,"uploads/eventPics");
    },
    filename:function (req,file,cb){
      cb(null,Date.now()+ path.extname(file.originalname));
    }
  })
  
  const fileFilter =(req,file,cb)=>{
    const allowedFileType=['image/jpeg','image/jpg','image/png'];
    if(allowedFileType.includes(file.mimetype)){
      cb(null,true);
    }else{
      cb(null,false);
    }
  }
  const upload=multer({storage:storage,fileFilter});


eventRouter
  .route("/")
  .get(getAllEvents)
eventRouter
  .route("/add")
  .post(protectedRouter,upload.single("eventBanner"),addEvent)
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
        console.log("get all events here ");        
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
    console.log("val of req.body is:",req.body);
    console.log("val of req.file is:",req.file);
   try{
        const receivedEvent=req.body;
        receivedEvent.eventBanner=req.file.filename;
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