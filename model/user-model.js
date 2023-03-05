const mongoose=require("mongoose");
// const bcrypt=require("bcrypt");

const userSchemna=new mongoose.Schema({
     name:{
        type:String,
        required:true,
     },
     email:{
        type:String,
        required:true,
        unique:[true,"Email ID must be unique"]
     },
     designation:{
      type:String,
      required:true,
     },
});
const userCollection=new mongoose.model("userCollection",userSchemna);
module.exports=userCollection;