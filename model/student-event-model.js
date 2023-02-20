const mongoose=require("mongoose");

// const studentEventSchema=new mongoose.Schema({
//      eventId:{
//         type:String,
//         required:true,
//      },
//      studentId:{
//         type:String,
//         required:true 
//      },
//      studentEmail:{//teacher id from teacherSchema ref to objId
//         type:String,
//         required:true
//      },
//      collegeName:{
//         type:String,
//         required:true
//      },
//      participatingSports:{
//         type:[String],
//         default:[]
//      },
// });

const studentEventSchema=new mongoose.Schema({//all the participating event wrt to student id
   studentId:{
      type: String,
      required: true,
   },
   studentEmail:String,
   studentCollegeName:{
      type:String,
   },
   eventsArray:[
      {
         eventId:{
            type:String,
            required:true,
         },//or eventId:mongoose.Schema.Types.ObjectId
         hostingClg:String,
         // eventBanner:String,
         participatingSports:{
            type:[String],
            default:[]
         },
      }
   ],
});


const studentEventCollection=new mongoose.model("studentEventCollection",studentEventSchema);
module.exports=studentEventCollection;

//HOW THE DABASE LOOK IN TABULAR FORM-----------------------------
// studentId | eventArray[{eventId1,hostingclg1,participatingSports},{eventId2...},{},..]
// 222332    | [{1111,nist,["cricket","volley"]},{},{}..]
//3344343    | [{3333,rit,["df","dff"]},{},{},...]

