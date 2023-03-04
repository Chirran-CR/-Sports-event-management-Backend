const express=require("express");
const jsonwebtoken=require("jsonwebtoken");
const eventCollection = require("../model/event-model");
const studentCollection = require("../model/student-model");
const studentEventCollection=require("../model/student-event-model");

const selectParticipantRouter=express.Router();
const teacherEventUploadCollection=require("../model/teacher-event-upload-model");
// const eventCollection=require("../model/event-model");
const jsonSecretKey=process.env.JSON_SECRET_KEY;

selectParticipantRouter
    .route("/:id")
    .get(sendDetails)

async function sendDetails(req,res){
    // console.log("Val of req.body",req.body);
    let teacherId=req.params.id;
    const teacherUploadObj=await teacherEventUploadCollection.find({teacherId:teacherId});
    const eventsArray=teacherUploadObj[0].eventsArray;
    // console.log("Val of eventsArray is:",eventsArray);
    const uploadedEventId=eventsArray.map((ev)=>{
        return ev.eventId;
    })
    let sendDetailsObj=[];
    console.log("Val of uploadedEventId:",uploadedEventId);

    for(let id of uploadedEventId){
        let obj={eventId:id};
        const eventObj=await eventCollection.find({_id:id});
        if(eventObj.length >0){
            console.log("Val of eventObj inside map of selectParticipant is:",eventObj);
            obj.eventName=eventObj[0].eventName;
            obj.TeacherEmail=eventObj[0].TeacherEmail;
            obj.hostingCollege=eventObj[0].hostingCollege;
            obj.participatingColleges=eventObj[0].participatingColleges;
            obj.sportsCategory=eventObj[0].sportsCategory;
            obj.participatingStudents=[];
            eventObj[0]?.participatingStudents?.map((sId)=>{
                obj.participatingStudents.push({studentId:sId})
            })
            obj.venue=eventObj[0].venue;

            sendDetailsObj.push(obj);
        }
    }
    for(let obj of sendDetailsObj){
        for(let studObj of obj.participatingStudents){
            const studObjRes=await studentCollection.find({_id:studObj.studentId});
            studObj.name=studObjRes[0]?.name;
            studObj.email=studObjRes[0]?.email;
            studObj.gender=studObjRes[0]?.gender;
            studObj.collegeName=studObjRes[0]?.collegeName;
            studObj.profilePic=studObjRes[0]?.profilePic;
            const studParticipateObjRes=await studentEventCollection.find({studentId:studObj.studentId});
            for(let events of studParticipateObjRes[0].eventsArray){
                if(events.eventId == obj.eventId){
                    studObj.participatingSports=[...events.participatingSports];
                }
            }
        }
    }
 
    console.log("Val of sendDetailsObj is:",sendDetailsObj);

    res.send({
        message:"Details of participant has been sent",
        sendDetailsObj:sendDetailsObj
    })
}



module.exports=selectParticipantRouter;