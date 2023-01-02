const mongoose=require("mongoose");
const dbLink=process.env.DB_LINK;
mongoose.set("strictQuery", false);
mongoose.connect(dbLink,()=>{
   console.log("Database connected successfully...");
},6000000).catch((err)=>{
    console.log("error re baba:",err);
})