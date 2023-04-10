const express=require("express");
const jsonwebtoken=require("jsonwebtoken");
const multer=require("multer");
const path=require("path");
const nodemailer=require("nodemailer");


const eventRouter=express.Router();
const eventCollection=require("../model/event-model");
const subscribedUserCollection=require("../model/subscribed-user-model");

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
  .route("/:id")
  .get(getSingleEvent);
eventRouter
  .route("/add")
  .post(protectedRouter,upload.single("eventBanner"),addEvent)
eventRouter
  .route("/addselectedstudent/:id")
  .post(addSelectedStudent);
eventRouter
  .route("/addresult/:id")
  .post(addEventResult);
eventRouter
  .route("/getresult/:id")
  .get(getResult);
eventRouter
  .route("/getselectedstudent/:id")
  .get(getSelectedStudent);
eventRouter
  .route("/update/:id")
  .patch(protectedRouter,updateEvent)
eventRouter
  .route("/delete/:id")
  .delete(protectedRouter,deleteEvent)
eventRouter
  .route("/addmoderator")
  .post(addModerator);
eventRouter
  .route("/updatemoderator")
  .post(updateModerator);
eventRouter
  .route("/removemoderator")
  .post(removeModerator);
eventRouter
  .route("/addscore/:id")
  .post(addLiveScore);
eventRouter
  .route("/getlivescore/:id")
  .get(getLiveScore);


async function removeModerator(req,res){
  try{
    const afterRemovingModeratorRes=await eventCollection.findOneAndUpdate({_id:req.body.singleEvent._id},{moderators:[...req.body.singleEvent.moderators]},{returnOriginal:false});
    console.log("Val of afterRemovingModeratorRes is:",afterRemovingModeratorRes);
    res.send({
      message:"Moderator is updated",
      afterRemovingModeratorRes:afterRemovingModeratorRes,
      errorPresent:false,
    })
  }catch(err){
    console.log("Error in updateModerator function..",err);
    res.send({
        message:"error in updateModerator function",
        errorDetails:err.message,
        errorPresent:true,
    })
  }
}


async function updateModerator(req,res){
  try{
    //todo- find the event through evnetId then update the moderator details by findOneAndUpdate,
    const afterUpdatingModeratorRes=await eventCollection.findOneAndUpdate({_id:req.body.singleEvent._id},{moderators:[...req.body.singleEvent.moderators]},{returnOriginal:false});
    console.log("Val of afterUpdatingModeratorRes is:",afterUpdatingModeratorRes);
    res.send({
      message:"Moderator is updated",
      errorPresent:false,
    })
  }catch(err){
    console.log("Error in updateModerator function..",err);
    res.send({
        message:"error in updateModerator function",
        errorDetails:err.message,
        errorPresent:true,
    })
  }
}


async function getLiveScore(req,res){
  const eventId=req.params.id;

  try{        
    const singleEvent=await eventCollection.find({_id:eventId});
    const liveScoreOfSingleEvent=singleEvent[0].liveScore;
    console.log("Val of resultOfSingleEvent is:",liveScoreOfSingleEvent);

    res.send({
        message:"Obtained livescore of single events",
        liveScoreOfSingleEvent:liveScoreOfSingleEvent
    })
  }catch(err){
    console.log("Error in getLiveScore function..",err);
    res.send({
        message:"error in getLiveScore function",
        errorDetails:err.message
    })
}
}
async function addLiveScore(req,res){
  console.log("Val of req.body inside addLiveScore is:",req.body);
  const eventId=req.params.id;
  const selectedSport=req.body.sport;
  try{
      //TODO- first check if the sport is already present then update the score else add the sport with score
      const singleEventRes=await eventCollection.find({_id:eventId});
      const singleEvent=singleEventRes[0];
      let alreadyPresentLiveScore=singleEvent.liveScore;
      let isSportPresent=false;
      alreadyPresentLiveScore.map((scoreObj)=>{
         if(scoreObj.sport == selectedSport){
          isSportPresent=true;
         }
      })
      console.log("Val of isSportPresent is:",isSportPresent);
      if(isSportPresent){
        alreadyPresentLiveScore=alreadyPresentLiveScore.map((scoreObj)=>{
             if(scoreObj.sport== selectedSport){
              scoreObj.score={...req.body.score}
             }
             return scoreObj;
        })
      }else{
        alreadyPresentLiveScore.push({
          sport:selectedSport,
          score:{...req.body.score}
        })
      }
      console.log("Val of alreadyPresentLiveScore is:",alreadyPresentLiveScore);
      const afterAddingLiveScoreRes=await eventCollection.findOneAndUpdate({_id:eventId},{liveScore:[...alreadyPresentLiveScore]},{returnOriginal:false});
      console.log("Val of afterAddingLiveScoreRes is:",afterAddingLiveScoreRes);
      res.send({
        message:"Score is updated/added",
        liveScore:alreadyPresentLiveScore,
        afterAddingLiveScoreRes:afterAddingLiveScoreRes
      })
   }catch(err){
    console.log("Error in addLiveScore function..",err);
    res.send({
        message:"error in addLiveScore function",
        errorDetails:err.message
    })
  }
}

async function addModerator(req,res){
  console.log("Val of req.body inside addModerator is:",req.body);
  try{
      // const toBeUpdateEvent=await eventCollection.find({_id:req.body._id});
      const afterAddingModeratorRes=await eventCollection.findOneAndUpdate({_id:req.body._id},{moderators:[...req.body.moderators]},{returnOriginal:false});
      console.log("Val of afterAddingModeratorRes is:",afterAddingModeratorRes);
      res.send({
        message:"Moderator is updated successfully",
        afterAddingModeratorRes:afterAddingModeratorRes
      })
   }catch(err){
    console.log("Error in addModerator function..",err);
    res.send({
        message:"error in addModerator function",
        errorDetails:err.message
    })
  }
}
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
async function getSingleEvent(req,res){
  const id=req.params.id;
  try{
      // console.log("get all events here ",req);
      console.log("get single event here ");        
      const singleEvent=await eventCollection.find({_id:id});
      res.send({
          message:"Obtained single event",
          singleEvent:singleEvent
      })
  }catch(err){
      console.log("Error in getSingleEvent function..",err);
      res.send({
          message:"error in getSingleEvent function",
          errorDetails:err.message
      })
  }

}
function sendMailToSubscriber(subscriberEmail){
    try{
      const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
          user:process.env.MAIL_ID,
          pass:process.env.MAIL_PSD,
        }
      })
      const mailOptions={
         from:process.env.MAIL_ID,
         to:subscriberEmail,
         subject:"HURRAHHH...! A New Event...!",
         html:`<h1>Greetings from Chirran..!</h1>
               <h2>A new event of your interest has been uploaded in sports event management platform.
                   You can go and check it out.</h2>
               <h2>Thank you</h2>`
        }
      transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
          console.log("Error inside transporter.sendMail function & error is:",error);
        }else{
          console.log("Email sent & info.resposne is:"+info.response);
          console.log("Val of info is:",info);
          return info;
        }
      })  
    }catch(err){
      console.log("Error in sendMailToSubscriber function ..",err.message);
      return err.message;
    }
}
async function addEvent(req,res){
    console.log("val of req.body inside addEvent of eventRouter is:",req.body);
    console.log("Type of registartion deadline is:",typeof req.body.registrationDeadline);

    console.log("val of req.file inside addEvent of eventRouter is:",req.file);
   try{
        const receivedEvent=req.body;
        receivedEvent.eventBanner=req.file.filename;
        // receivedEvent.registrationDeadline=req.body.registrationDeadline;
        // console.log("Val of received event inside addEvent of eventRouter is:",receivedEvent);
        const addedEvent=await eventCollection.create(receivedEvent);
        // const addEventObj= new eventCollection({...receivedEvent});
        // const addedEvent= await addEventObj.save();
        console.log("Val of receivedEvent is :",receivedEvent);
        const allSubscribersRes=await subscribedUserCollection.find({});
        console.log("Val of allSubscriberRes is",allSubscribersRes)//received array of subscriber Obj
        const emailOfSubscribedUser=allSubscribersRes.map((user)=>{
           if(user.favSport == "All" && user.interestedClg == "All"){
            return user.email;
           }else if(user.favSport != "All" && user.interestedClg == "All"){
             if(req.body.sportsCategory.includes(user.favSport)){
              return user.email;
             }
           }else if(user.favSport == "All" && user.interestedClg != "All"){
             if(req.body.participatingColleges.includes(user.interestedClg)){
               return user.email;
             }
           }else{
             if(req.body.sportsCategory.includes(user.favSport) && req.body.participatingColleges.includes(user.interestedClg)){
              return user.email;
             }
           }
        })
        console.log("val of subscribed user is:",emailOfSubscribedUser);

        const allTheInfo = emailOfSubscribedUser.map((mailId)=>{
          sendMailToSubscriber(mailId);
        })
        console.log("Val of all the info from sentMail function:",allTheInfo);
        res.send({
             message:"Event added successfully..",
             addedEventDetails:addedEvent,
            //  allTheInfo:allTheInfo
        })
   }catch(err){
    console.log("Error in addEvent fn:",err);
    res.send({
        message:"Error in addEvent fn",
        errorDetails:err
    })
   }
}
async function getSelectedStudent(req,res){
  const eventId=req.params.id;
  console.log("val of req.body in getSelectedStudent is:",req.body);
  try{
    const eventObjRes=await eventCollection.find({_id:eventId});
    const selectedStudents=[...eventObjRes[0].selectedStudents];
    console.log("Val of selectedStudents inside getSelected function:",selectedStudents);
        res.send({
             message:"Selected student obtained successfully..",
             allSelectedStudent:selectedStudents,
        })
  }catch(err){
    console.log("Error in getSelectedEvent fn:",err);
    res.send({
        message:"Error in getSelectedEvent fn",
        errorDetails:err
    })
  }
}
async function addSelectedStudent(req,res){
  const eventId=req.params.id;
  console.log("Val of req.body inside addSelectedStudent is:",req.body);
  const eventObjRes=await eventCollection.find({_id:eventId});
  // eventObjRes[0].selectedStudents = [...req.body];
  // console.log("Val of eventObjRes is:",eventObjRes);
  const selectedStudentsForSingleSport={
    selectedSport:req.body.selectedSport,
    studentInfo:[...req.body.sendSelectedStudent]
  }
  const selectedStudents=[...eventObjRes[0].selectedStudents,selectedStudentsForSingleSport];
  const afterAddingSelectedStudentRes=await eventCollection.findOneAndUpdate({_id:eventId},{selectedStudents:selectedStudents},{returnOriginal:false});
  console.log("Val of afterAddingSelectedStudentRes is:",afterAddingSelectedStudentRes);
  try{
    res.send({
      message:"Selected Student added in the event Collection successfully",
      // eventObjRes:eventObjRes,
      afterAddingSelectedStudentRes:afterAddingSelectedStudentRes
    })
  }catch(err){
    console.log("Error in addSelectedStudent fn:",err);
    res.send({
        message:"Error in addSelectedStudent fn",
        errorDetails:err
    })
  }
}
async function addEventResult(req,res){
  const eventId=req.params.id;
  console.log("Val of req.body inside addEvnetRes is:",req.body);
  const eventObjRes=await eventCollection.find({_id:eventId});
  const updatedResult=[...eventObjRes[0].result,{...req.body}];
  console.log("val of updatedRes is:",updatedResult);
  const afterAddingResult=await eventCollection.findOneAndUpdate({_id:eventId},{result:updatedResult},{returnOriginal:false});
  try{
     res.send({
      message:"Result added successfully",
      updatedRes:updatedResult,
      afterAddingResult:afterAddingResult,
     })
  }catch(err){
    console.log("Error in addEventResult fn:",err);
    res.send({
        message:"Error in addEventResult fn",
        errorDetails:err
    })
  }
}
async function getResult(req,res){
  console.log("Inside getResult of eventRouter..");
  const eventId=req.params.id;
  const eventRes=await eventCollection.find({_id:eventId});
  const resultOfEvent=eventRes[0].result;
  console.log("Val of resultOFEvent is:",resultOfEvent);
  try{
    res.send({
      message:"Results of event received successfully",
      resultOfEvent:resultOfEvent,
      completeEvent:eventRes[0],
    })
  }catch(err){
    console.log("Error in getResult fn:",err);
    res.send({
        message:"Error in getResult fn",
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