const mongoose=require("mongoose");

const studentEventSchema=new mongoose.Schema({
     eventId:{
        type:String,
        required:true,
     },
     studentId:{
        type:String,
        required:true
     },
     studentEmail:{//teacher id from teacherSchema ref to objId
        type:String,
        required:true
     },
     collegeName:{
        type:String,
        required:true
     },
     participatingSports:{
        type:[String],
        default:[]
     },
});

const studentEventCollection=new mongoose.model("studentEventCollection",studentEventSchema);
module.exports=studentEventCollection;