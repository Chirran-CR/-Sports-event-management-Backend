const mongoose=require("mongoose");
const myValidator=require("validator");
const bcrypt=require("bcrypt");

const teacherSchema=new mongoose.Schema({
    name:{type:String,
          required:[true,"Name must be there"],
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(val){
            if(!myValidator.isEmail(val)){
                throw new Error("Email ID is not valid...");
            }
        }
    },
    password:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        required:true,
    },
    collegeName:{
        type:String,
        required:true,
    },
    profilePic:{
        type:String,
       }
})


teacherSchema.pre("save",async function (){
    const teacherDocument=this;
    const salt=await bcrypt.genSalt();
    const hashedPsd=await bcrypt.hash(teacherDocument.password,salt);
    teacherDocument.password=hashedPsd;
    teacherDocument.confirmPassword=undefined;
});


const teacherCollection=new mongoose.model("teachercollection",teacherSchema);
module.exports=teacherCollection;