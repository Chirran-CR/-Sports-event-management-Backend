const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

const studentSchema=new mongoose.Schema({
     name:{
        type:String,
        required:true,
     },
     email:{
        type:String,
        required:true,
        unique:[true,"Email ID must be unique"]
     },
     password:{
        type:String,
        required:true,
     },
     confirmPassword:{
        type:String,
        required:true
     },
     collegeName:{
        type:String,
        required:true
     }
});
studentSchema.pre("save",async function (){
    const studentDoc=this;
    const salt=await bcrypt.genSalt();
    const hashedPsd=await bcrypt.hash(studentDoc.password,salt);
    studentDoc.password=hashedPsd;
    studentDoc.confirmPassword=undefined;
})
const studentCollection=new mongoose.model("studentcolleciton",studentSchema);
module.exports=studentCollection;