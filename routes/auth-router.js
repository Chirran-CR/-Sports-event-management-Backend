const express = require("express");
const bcrypt=require("bcrypt");
const jsonwebtoken=require("jsonwebtoken");
const multer=require("multer");
const path=require("path");
const crypto = require("crypto");

const authRouter = express.Router();
const teacherCollection = require("../model/teacher-model");
const studentCollection = require("../model/student-model");
const tokenCollection = require("../model/token-model");
const jsonSecretKey=process.env.JSON_SECRET_KEY;
const sendVerificationMail= require("../utils/mailFunctions");
const userCollection = require("../model/user-model");


const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,"uploads/profilePics");
  },
  filename:function (req,file,cb){
    cb(null,Date.now()+ path.extname(file.originalname));
  }
})

const fileFilter =(req,file,cb)=>{
  const allowedFileType=['image/jpeg','image/jpg','image/png'];
  if(allowedFileType.includes(file.mimetype)){
    cb(null,true);
  }else{
    cb(null,false);
  }
}
const upload=multer({storage:storage,fileFilter});


authRouter.route("/teacher/login").post(teacherLogin);
authRouter.route("/teacher/signup").post(upload.single("profilePic"),teacherSignup);
authRouter.route("/teacher/logout").get(teacherLogout);
authRouter.route("/student/login").post(studentLogin);
authRouter.route("/student/signup").post(upload.single("profilePic"),studentSignup);
authRouter.route("/student/logout").get(studentLogout);
authRouter.route("/:designation/:id/verify/:token").get(verifyEmailForRegistration);



async function verifyEmailForRegistration(req,res){
    try{
      const designation=req.params.designation;
      console.log("Val of designation is:",designation);
      const collection=designation=="teacher"? teacherCollection:studentCollection;
      console.log("Val of collection is:",collection);
      const user=await collection.findOne({_id:req.params.id});
      console.log("Val of user is:",user);

      // if(!user) return res.status(400).send({message:"Invalid Link"});
      if (!user) res.sendFile(__dirname+'/htmlPages/failedScreen.html');

      const token = await tokenCollection.findOne({
        userId: user._id,
        token: req.params.token,
      });
      console.log("Val of token inside verifyEmail is:",token);

      // if (!token) return res.status(400).send({ message: "Invalid link for token" });
      if (!token) res.sendFile(__dirname+'/htmlPages/failedScreen.html');
  
      await collection.updateOne({ _id: user._id},{ $set:{verified: true} });
      await token.remove();
      const updatedUser=await collection.findOne({_id:req.params.id});
      console.log("Val of updatedUser is:",updatedUser);
      const userObj={
        name:updatedUser.name,
        email:updatedUser.email,
        designation:designation,
    }
        // await userCollection.dropIndexes();
        const userDetails= await userCollection.create(userObj);
        // res.send({
        //     message:"User is added to the userDatabase",
        //     userDetails:userDetails,
        // })
       console.log("Val of userDetails is:",userDetails);
      // res.status(200).send({ message: "Email verified successfully" });
      res.sendFile(__dirname+'/htmlPages/successfulScreen.html');
    }catch(err){
      // res.send({//to show the error in frontend becz request full fill nhi ho rha h status code 404 add karne par
      //   message:"Error in verifyEmailForRegistration function",
      //   errorMessage:err.message,
      //   myError:true
      // })
      console.log("Error in verifyEmailForRegistration function and errr is:",err.message);
     res.sendFile(__dirname+'/htmlPages/failedScreen.html');

    }
}


async function teacherLogin(req, res) {
  try{
     const teacherInfo=req.body;
      const storedTeacher=await teacherCollection.findOne({email:teacherInfo.email});//here couldn't use find({email:teacherInfo.email})=>gives an error as: data and hash arguments required
      
      console.log("Stored tEAcher",storedTeacher);
      if(storedTeacher){
          if(storedTeacher.verified == false){
            res.send({
              message:"Teacher is not verified..",
              showMessage:"You are not Verified, click on the received mail to verify",
              teacherDetails:storedTeacher,
              myError:true
            })
          }else{
            const psdMatched=await bcrypt.compare(teacherInfo.password,storedTeacher.password);
            console.log("psdMatched value:",psdMatched);
            if(psdMatched){
              console.log("Login successful");
              const teacherToken=jsonwebtoken.sign({teacherId:storedTeacher._id},jsonSecretKey);
              // console.log("teacher token ki value:",teacherToken);
              res.cookie("isTeacherLogin",teacherToken);

              res.status(200).send({
                message:"Teacher Login successful..",
                teacherDetails:storedTeacher,
                myError:false
              })
            }else{
              console.log("Password did not matched..");
              res.send({
                message:"Invalid credetials..",
                myError:true
              })
            }
          }
      }else{
          console.log("Email id not present in db so first sign up");
          res.send({
            message:"Invalid credetials..You should signup first",
            myError:true
          })
      }
    }catch(err){
        // res.status(400).send({
          res.send({//to show the error in frontend becz request full fill nhi ho rha h status code 404 add karne par
            message:"Error in teacher login function",
            errorMessage:err.message,
            myError:true
          })
    }
}

function teacherLogout(req,res){
  res.cookie("isTeacherLogin","",{maxAge:1});
  res.send({
    message:"Teacher logout successfully.."
  })
}

async function teacherSignup(req, res) {
  const teacherData = req.body;
  console.log("teacher data:",teacherData);
  teacherData.profilePic=req.file.filename;
  try {
    const teacherDoc=new teacherCollection(teacherData);
    const savedTeacherData=await teacherDoc.save();
    const token=await new tokenCollection({
        userId:savedTeacherData._id,
        token:crypto.randomBytes(32).toString("hex"),
    }).save();  
    console.log("savedTeacherData in teacherSignup fn is:",savedTeacherData);
    const url=`${process.env.BASE_URL}/auth/teacher/${savedTeacherData._id}/verify/${token.token}`;
    await sendVerificationMail(savedTeacherData.email,url);
    res.send({
      message: "Teacher signed up successfully...",
      teacherData: savedTeacherData,
      myError:false,
    });
  } catch (err) {
    console.log("Error in teacherSignup function and value is:", err);
    res.send({
      message: "Error in teacherSignup function..",
      errorVal: err,
      myError:true,
    });
  }
}

async function studentLogin(req, res) {
  try{
     const studentInfo=req.body;
      const storedStudent=await studentCollection.findOne({email:studentInfo.email});//here couldn't use find({email:teacherInfo.email})=>gives an error as: data and hash arguments required
      
      console.log("Stored student",storedStudent);
      if(storedStudent){
        if(storedStudent.verified == false){
          res.send({
            message:"Teacher is not verified..",
            showMessage:"You are not Verified, click on the received mail to verify",
            studentDetails:storedStudent,
            myError:true
          })
        }else{
          const psdMatched=await bcrypt.compare(studentInfo.password,storedStudent.password);
          console.log("psdMatched value:",psdMatched);
          if(psdMatched){
            console.log("Login successful");
            const studentToken=jsonwebtoken.sign({studentId:storedStudent._id},jsonSecretKey);
            // console.log("student token ki value:",studentToken);
            res.cookie("isStudentLogin",studentToken);

            res.status(200).send({
              message:"Student Login successful..",
              studentDetails:storedStudent,
              myError:false,
            })
          }else{
            console.log("Password did not matched..");
            res.send({
              message:"Invalid credetials..",
              myError:true,
            })
          }
        }
      }else{
          console.log("Email id not present in db so first sign up");
          res.send({
            message:"Invalid credetials..You should signup first",
            myError:true
          })
      }
    }catch(err){
        res.send({
            message:"Error in student login function",
            errorMessage:err.message,
            myError:true
          })
    }
}


function studentLogout(req,res){
  res.cookie("isStudentLogin","",{maxAge:1});
  res.send({
    message:"Student logout successfully.."
  })
}

async function studentSignup(req, res) {
  const studentData = req.body;
  console.log("value of req is:",req);
  console.log("Student data received is:",studentData);
  console.log("req.file is:",req.file);
  studentData.profilePic=req.file.filename;
  try {
    const studentDoc=new studentCollection(studentData);
    const savedStudentData=await studentDoc.save();
    const token=await new tokenCollection({
      userId:savedStudentData._id,
      token:crypto.randomBytes(32).toString("hex"),
    }).save();  
    console.log("savedStudentData in studentSignup fn is:",savedStudentData);
    const url=`${process.env.BASE_URL}/auth/student/${savedStudentData._id}/verify/${token.token}`;
    await sendVerificationMail(savedStudentData.email,url);
    res.send({
      message: "Verification mail has been sent successfully...",
      teacherData: savedStudentData,
      myError:false,
    });
  } catch (err) {
    console.log("Error in studentSignup function and value is:", err);
    res.send({
      message: "Error in studentSignup function..",
      errorVal: err,
      myError:true
    });
  }
}

module.exports = authRouter;
