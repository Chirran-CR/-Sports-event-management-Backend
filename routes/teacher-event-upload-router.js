const express=require("express");
const jsonwebtoken=require("jsonwebtoken");

const teacherEventUploadRouter=express.Router();
const teacherEventUploadCollection=require("../model/teacher-event-upload-model");
const jsonSecretKey=process.env.JSON_SECRET_KEY;

teacherEventUploadRouter
  .route("/:id")
  .get(getAllUploadedEvents)
teacherEventUploadRouter
  .route("/add/:id")
  .post(addEvent)
teacherEventUploadRouter
  .route("/:id")
  .put(updateEvent)
teacherEventUploadRouter
  .route("/:id")
  .delete(deleteEvent)

 

// let teacherId;
// function protectedRouter(req,res,next){
//    console.log("inside protected Router of student-event-router"); 
//    //here check whether the cookies contain the jwt token and if contain then only proceed
//    const studentCookie=req.cookies?.isStudentLogin;
//    console.log("student cookie ki value:",studentCookie);
//    if(studentCookie){
//        const isVerified=jsonwebtoken.verify(studentCookie,jsonSecretKey);
//        console.log("value of isVerified:",isVerified);//value of isVerified: { teacherId: '637b628e61ec9902cfc7da18', iat: 1669140050 }
//        if(isVerified){
//           studentId=isVerified.studentId;
//           console.log("Student is authenticated..");
//           next();
//        }else{
//          console.log("Student authentication failed..");
//          res.send({
//             message:"You should login again(as cookie has been deleted).."
//          })
//        }
//    }else{
//     console.log("Student cookie not found");
//     res.send({
//         message:"You should login first(Student cookie not found)"
//     })
//    }
// }

async function getAllUploadedEvents(req,res){
    try{
        const teachId=req.params.id;
        console.log("Inside getAllUploadedEvents of teacher-event-upload-router..& teachreId is:",teachId);
        const allUploadedEvents=await teacherEventUploadCollection.find({teacherId:teachId});
        console.log("Val of allUploadedEvents..",allUploadedEvents);

        res.send({
            message:"Obtained all the Uploaded events",
            uploadedEventsDetails:allUploadedEvents
        })
    }catch(err){
        console.log("Error in getAllUploadedEvents function..",err);
        res.send({
            message:"error in getAllUploadedEvents function",
            errorDetails:err.message
        })
    }
 
}
async function updateEvent(req,res){
    let teachId=req.params.id;
    console.log("teach id inside updateEvent is:",teachId);
    let teacherObjArray=await teacherEventUploadCollection.find({teacherId:teachId}); 
    console.log("Val of studentObj is:",teacherObjArray);

    const initialEventsArray=teacherObjArray[0].eventsArray;
    console.log("Val of eventsArray is:",initialEventsArray);
    const changedEventsArray=initialEventsArray?.map((event)=>{
        if(event.eventId == req.body.eventId){
                event.sportsCategory=[...req.body.sportsCategory];
                event.participatingClgs=[...req.body.participatingClgs]            
                // event.participatingSports=[...req.body.participatingSports]
           
        }
        return event;
    })
    
    console.log("Val of changedEventsArray is:",changedEventsArray);
    // const updatedStudentParticipation=await studentEventCollection.updateOne({studentId:studId},{eventsArray:changedEventsArray},{new:true})
    const updatedTeacherEventUpload=await teacherEventUploadCollection.findOneAndUpdate({teacherId:teachId},{eventsArray:changedEventsArray},{returnOriginal: false})

    console.log("Val of updatedStudentParticipation is:",updatedTeacherEventUpload);
    try {
        console.log("Val of req.body inside updateEvent is:",req.body);
        res.send({
            message:"Obtained all the events",
            // updatedStudentParticipation:updatedStudentParticipation
            // participatedEventsDetails:allParticipatingEvents
            updatedTeacherEventUpload:updatedTeacherEventUpload
        })
    } catch (error) {
        console.log("Error in updateEvent fn:",err);
        res.send({
            message:"Error in updateEvent fn",
            errorDetails:err
        })
    }
}
async function addEvent(req,res){
   try{
        // const receivedData=req.body;
        let eventDoc;
        let teacherId=req.params.id;
        console.log("req.body in ddEvent of teacher-event-upload-router  is:",req.body);
        const eventObj={eventId:req.body.eventId,
                        // hostingClg:req.body.hostingClg,
                        sportsCategory:[...req.body.sportsCategory],
                        participatingClgs:[...req.body.participatingColleges],
                        venue:req.body.venue
        }
        // const alreadyExistData=await studentEventCollection.find({studentId:studentId});
        // console.log("Val of alredayExists is:",alreadyExistData);
        const findData=await teacherEventUploadCollection.find({teacherId:teacherId});
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
            eventDoc=await teacherEventUploadCollection.findOneAndUpdate({teacherId:teacherId},updateDoc,{returnOriginal:false})
        }else{
            let notAlreadyExistData={};
            notAlreadyExistData.teacherId=teacherId;
            notAlreadyExistData.teacherEmail=req.body.TeacherEmail;
            notAlreadyExistData.teacherCollegeName=req.body.hostingCollege;
            notAlreadyExistData.eventsArray=[eventObj];
            console.log("val of notAlreadyExist after adding data:",notAlreadyExistData);
            
            eventDoc=await teacherEventUploadCollection.create(notAlreadyExistData);
        }
        res.send({
             message:"Event added successfully..",
             addedEventDetails:eventDoc
        })
   }catch(err){
    console.log("Error in addEvent of teacher-event-upload-router fn:",err);
    res.send({
        message:"Error in ddEvent of teacher-event-upload-router  fn",
        errorDetails:err
    })
   }
}

async function deleteEvent(req,res){
    const teachId=req.params.id;
    console.log("Val of teachId is:",teachId);
    console.log("Val of req.body is:",req.body);//{ event_id: '638c15f5d1877203f6f52c97' }
    const eventId=req.body.event_id;
    console.log("Val of eventId is:",eventId);
    let teacherObjArray=await teacherEventUploadCollection.find({teacherId:teachId}); 
    const initialEventsArray=teacherObjArray[0].eventsArray;
    const changedEventsArray=initialEventsArray?.filter((event)=>{
        return event.eventId != eventId; 
    })
    console.log("Val of changedEventsArray is:",changedEventsArray);

    const afterDeletionTeacherUploadedEvent=await teacherEventUploadCollection.findOneAndUpdate({teacherId:teachId},{eventsArray:changedEventsArray},{returnOriginal: false})
    console.log("Val of updatedTeacherCollection is:",afterDeletionTeacherUploadedEvent);

    try{
        res.send({
            message:"Event deleted successfully",
            afterDeletionTeacherUploadedEvent:afterDeletionTeacherUploadedEvent
        })
    }catch(error){
        console.log("Error in event delete fn:",err);
        res.send({
            message:"Error in event delete fn",
            errorDetails:err
        })
    }
}

module.exports=teacherEventUploadRouter;