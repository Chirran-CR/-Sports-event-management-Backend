const mongoose=require("mongoose");

const eventSchema=new mongoose.Schema({
     eventName:{
        type:String,
        required:true,
     },
     TeacherEmail:{//teacher id from teacherSchema ref to objId
        type:String,
        required:true
     },
     hostingCollege:{
        type:String,
        required:true
     },
     participatingColleges:{
        type:[String],
        default:[]
     },
     participatingStudents:{
       type:[String],
       default:[]
     },
     sportsCategory:{
        type:[String],
        required:true
     },
     selectedStudents:[{
      selectedSport:{
         type:String
      },
      studentInfo:[{
       studentId:String,
       profilePic:String,
       name:String,
       email:String,
       collegeName:String,
       gender:String,
       participatingSports:[String],
     }]}],
     venue:{
        type:String,
        required:true,
     },
     eventBanner:{
      type:String,
     }
});

const eventCollection=new mongoose.model("eventcolleciton",eventSchema);
module.exports=eventCollection;