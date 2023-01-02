const express=require("express");
const teacherCollection=require("../model/teacher-model");
const teacherRouter=express.Router();

teacherRouter
    .route("/")
    .get()

module.exports=teacherRouter;