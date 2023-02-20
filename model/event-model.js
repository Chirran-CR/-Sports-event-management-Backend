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
     sportsCategory:{
        type:[String],
        required:true
     },
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