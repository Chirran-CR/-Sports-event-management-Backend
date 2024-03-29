const express=require("express");
const dotenv=require("dotenv");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const path=require("path");


dotenv.config({path:"./configuration/config.env"});
require("./database/conn.js");
const port=process.env.PORT;

const app=express();


// const teacherRouter=require("./routes/teacher-router");
const authRouter=require("./routes/auth-router");
const eventRouter=require("./routes/event-router");
const studentEventRouter=require("./routes/student-event-router");
const teacherEventUploadRouter=require("./routes/teacher-event-upload-router");
const selectParticipantRouter=require("./routes/select-participant-router");
const subscribedUserRouter = require("./routes/subscribed-user-router.js");
const userRouter = require("./routes/user-router.js");
const moderatorRouter = require("./routes/moderator-router.js");
const teacherRouter = require("./routes/teacher-router.js");
const studentRouter = require("./routes/student-router.js");
const paymentRouter=require("./routes/payment-router.js");
const { default: mongoose } = require("mongoose");
// const participatedEventRouter=require("./routes/participated-events-router");

const corsOrigin ={
    origin:['http://localhost:3000',"https://sports-event.onrender.com"],//or whatever port your frontend is using
    headers:["Content-Type"],
    credentials:true,            
    optionSuccessStatus:200
}
app.use(cors(corsOrigin));
// app.options('*', cors()); 
app.use(express.json());
app.use(cookieParser());
// app.use(cors({origin: true, credentials: true}));
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// app.use("/event", (req,res)=>{
//     res.send({
//         message:"working properly",
//         data:req.body
//     })
// })
console.log("val of __dirname is:",__dirname);
app.use("/event/student",studentEventRouter);
app.use("/event/teacher",teacherEventUploadRouter);
// app.use("/teacher",teacherRouter);
app.use("/auth",authRouter);
app.use("/event",eventRouter);
app.use("/subscribe",subscribedUserRouter);
app.use("/user",userRouter);
app.use("/moderator",moderatorRouter);
app.use("/teacher",teacherRouter);
app.use("/student",studentRouter);
app.use("/payment",paymentRouter);
// app.use("/event/student",participatedEventRouter);
// app.use(express.static(path.join(__dirname,"./frontend/build")));
// app.get("*",(req,res)=>{
    //      res.sendFile(path.join(__dirname,"./frontend/build/index.html"));
    // });
app.use("/images",express.static(path.join(__dirname,'uploads')));
app.use("/selectparticipant",selectParticipantRouter);
console.log(mongoose.connection.readyState);
app.listen(port,()=>{
    console.log(`Server is listening at port: ${port}`);
});