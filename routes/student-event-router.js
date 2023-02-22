const express=require("express");
const jsonwebtoken=require("jsonwebtoken");

const studentEventRouter=express.Router();
const studentEventCollection=require("../model/student-event-model");
const eventCollection=require("../model/event-model");
const jsonSecretKey=process.env.JSON_SECRET_KEY;

studentEventRouter
  .route("/:id")
  .get(getAllParticipatingEvents)
studentEventRouter
  .route("/add")
  .post(protectedRouter,addParticipatingEvent)
studentEventRouter
  .route("/:id")
  .put(updateParticipatingEvents)
studentEventRouter
//   .route("/delete/:id")
//   .post(deleteParticipatingEvent)
  .route("/:id")
  .delete(deleteParticipatingEvent)

 

let studentId;
function protectedRouter(req,res,next){
   console.log("inside protected Router of student-event-router"); 
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
async function updateParticipatingEvents(req,res){
    let studId=req.params.id;
    console.log("Stud id inside updateParticipatingEvent is:",studId);
    let studentObjArray=await studentEventCollection.find({studentId:studId}); 
    console.log("Val of studentObj is:",studentObjArray);

    const initialEventsArray=studentObjArray[0].eventsArray;
    console.log("Val of eventsArray is:",initialEventsArray);
    const changedEventsArray=initialEventsArray?.map((event)=>{
        if(event.eventId == req.body.eventId){
            
                event.participatingSports=[...req.body.participatingSports]
           
        }
        return event;
    })
    
    console.log("Val of changedEventsArray is:",changedEventsArray);
    // const updatedStudentParticipation=await studentEventCollection.updateOne({studentId:studId},{eventsArray:changedEventsArray},{new:true})
    const updatedStudentParticipation=await studentEventCollection.findOneAndUpdate({studentId:studId},{eventsArray:changedEventsArray},{returnOriginal: false})

    console.log("Val of updatedStudentParticipation is:",updatedStudentParticipation);
    try {
        console.log("Val of req.body inside updateParticipatingEvents is:",req.body);
        res.send({
            message:"Obtained all the events",
            updatedStudentParticipation:updatedStudentParticipation
            // participatedEventsDetails:allParticipatingEvents
        })
    } catch (error) {
        console.log("Error in updateParticipatingEvents fn:",err);
        res.send({
            message:"Error in updateParticipatingEvents fn",
            errorDetails:err
        })
    }
}
async function addParticipatingEvent(req,res){
   try{
        // const receivedData=req.body;
        let eventDoc;
        console.log("req.body in addParticipatingEvent is:",req.body);
        const eventObj={eventId:req.body.eventId,
                        hostingClg:req.body.hostingClg,
                        participatingSports:[...req.body.participatingSports],
        }
        // const alreadyExistData=await studentEventCollection.find({studentId:studentId});
        // console.log("Val of alredayExists is:",alreadyExistData);
        const findData=await studentEventCollection.find({studentId:studentId});
        console.log("Val of findData is:",findData);

        if(findData.length>0){
            let  allEventsWithUpdate;//it is an array ie. [{even1 details},{event2 details},....]
            allEventsWithUpdate=[...findData[0].eventsArray,eventObj];
            console.log("Val of allEventsWihUpdate is:",allEventsWithUpdate);
            const updateDoc = {
                $set: {
                  eventsArray:[...allEventsWithUpdate],
                },
              };
            console.log("Val of updateDoc is:",updateDoc);
            eventDoc=await studentEventCollection.update({studentId:studentId},updateDoc,{upsert:true})
        }else{
            let notAlreadyExistData={};
            notAlreadyExistData.studentId=studentId;
            notAlreadyExistData.studentEmail=req.body.studentEmail;
            notAlreadyExistData.studentCollegeName=req.body.collegeName;
            notAlreadyExistData.eventsArray=[eventObj];
            console.log("val of already exit after adding data:",notAlreadyExistData);
            
            eventDoc=await studentEventCollection.create(notAlreadyExistData);
        }
       //add participatingStudent to eventCollection
        const receivedEvent=await eventCollection.find({_id:req.body.eventId});
        console.log("Val of receivedEvent is:",receivedEvent);
        let updatedEvent=receivedEvent[0];
        if(!(receivedEvent[0].participatingStudents.includes(studentId))){
            const participatingStudents=[...receivedEvent[0]?.participatingStudents,studentId];
            updatedEvent=await eventCollection.findOneAndUpdate({_id:req.body.eventId},{participatingStudents:participatingStudents},{returnOriginal:false});
        }

        
        res.send({
             message:"Event added successfully..",
             addedEventDetails:eventDoc,
             updatedEvent:updatedEvent
        })
   }catch(err){
    console.log("Error in addParticipatingEvent fn:",err);
    res.send({
        message:"Error in addParticipatingEvent fn",
        errorDetails:err
    })
   }
}

async function deleteParticipatingEvent(req,res){
    const studId=req.params.id;
    console.log("Val of studId is:",studId);
    console.log("Val of req.body is:",req.body);//{ event_id: '638c15f5d1877203f6f52c97' }
    const eventId=req.body.event_id;
    console.log("Val of eventId is:",eventId);
    let studentObjArray=await studentEventCollection.find({studentId:studId}); 
    const initialEventsArray=studentObjArray[0].eventsArray;
    const changedEventsArray=initialEventsArray?.filter((event)=>{
        return event.eventId != eventId; 
    })
    console.log("Val of changedEventsArray is:",changedEventsArray);

    const afterDeletionStudentEventParticipation=await studentEventCollection.findOneAndUpdate({studentId:studId},{eventsArray:changedEventsArray},{returnOriginal: false})
    console.log("Val of updatedStudentParticipation is:",afterDeletionStudentEventParticipation);

    try{
        res.send({
            message:"Event deleted successfully",
            afterDeletionStudentEventParticipation:afterDeletionStudentEventParticipation
        })
    }catch(error){
        console.log("Error in addParticipatingEvent fn:",err);
        res.send({
            message:"Error in addParticipatingEvent fn",
            errorDetails:err
        })
    }
}

module.exports=studentEventRouter;