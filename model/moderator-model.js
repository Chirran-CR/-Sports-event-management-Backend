const mongoose=require("mongoose");
// const bcrypt=require("bcrypt");

const moderatorSchemna=new mongoose.Schema({
     name:{
        type:String,
        required:true,
     },
     email:{
        type:String,
        required:true,
        // unique:[true,"Email ID must be unique"]
     },
     password:{
      type:String,
      required:true,
     },
     eventId:String,
     selectedSport:String,
});
const moderatorCollection=new mongoose.model("moderatorCollection",moderatorSchemna);
module.exports=moderatorCollection;