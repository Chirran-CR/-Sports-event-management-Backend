const mongoose=require("mongoose");
const { Schema } = mongoose;

const participatedEventSchema=new mongoose.Schema({
     participatedEvent:{
        studentId:Schema.Types.ObjectId,
        studentName:String,
        studentEmail:String,
        studentCollege:String,
        myEvents:[{
            eventId:Schema.Types.ObjectId,
            eventName:String,
            hostedClg:String,
            participatedSports:[String],
        }]
     }
});

const participatedEventCollection=new mongoose.model("participatedEventCollection",participatedEventSchema);
module.exports=participatedEventCollection;