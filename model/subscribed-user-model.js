const mongoose=require("mongoose");
//const bcrypt=require("bcrypt");

const subscribedUserSchema=new mongoose.Schema({
    
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

const subscribedUserCollection=new mongoose.model("subscribedUser",subscribedUserSchema);
module.exports=subscribedUserCollection;