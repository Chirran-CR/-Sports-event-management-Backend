const mongoose=require("mongoose");


const teacherEventUploadSchema=new mongoose.Schema({//all the participating event wrt to student id
   teacherId:{
      type: String,
      required: true,
   },
   teacherEmail:String,
   teacherCollegeName:{
      type:String,
   },
   eventsArray:[
      {
         eventId:{
            type:String,
            required:true,
         },//or eventId:mongoose.Schema.Types.ObjectId
        //  hostingClg:String,//obviously teacher's college name
         // eventBanner:String,
         sportsCategory:{
            type:[String],
            default:[]
         },
         participatingClgs:{
            type:[String],
            default:[]
         },
         venue:{
            type:String
         }
      }
   ],
});


const teacherEventUploadCollection=new mongoose.model("teacherEventUploadCollection",teacherEventUploadSchema);
module.exports=teacherEventUploadCollection;

//HOW THE DABASE LOOK IN TABULAR FORM-----------------------------
// studentId | eventArray[{eventId1,hostingclg1,participatingSports},{eventId2...},{},..]
// 222332    | [{1111,nist,["cricket","volley"]},{},{}..]
//3344343    | [{3333,rit,["df","dff"]},{},{},...]

