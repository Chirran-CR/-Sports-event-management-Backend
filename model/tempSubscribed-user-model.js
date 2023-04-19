const mongoose=require("mongoose");
//const bcrypt=require("bcrypt");

const tempSubscribedUserSchema=new mongoose.Schema({
    
     email:{
        type:String,
        required:true,
        unique:[true,"Email ID must be unique"]
     },
     favSport:{
      type:String,
      required:true,
     },
     interestedClg:{
        type:String,
        required:true,
     },
});

const tempSubscribedUserCollection=new mongoose.model("tempSubscribedUser",tempSubscribedUserSchema);
module.exports=tempSubscribedUserCollection;