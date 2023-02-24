const express=require("express");

const subscribedUserRouter=express.Router();
const subscribedUserCollection=require("../model/subscribed-user-model");
console.log("inside subscribed user router");


subscribedUserRouter
    .route("/add")
    .post(addSubscriber)
// subscribedUserRouter
//     .route("/")
//     .get(getAllSubscriber)

// async function getAllSubscriber(req,res){
//     try{
//         const allSubscribers=await subscribedUserCollection.find({});
//         res.send({
//             message:"Subscriber fetched successfully",
//             allSubscribers:allSubscribers
//         })
//     }catch(err){
//         console.log("Error in getAllSubscriber function..",err);
//         res.send({
//             message:"error in getAllSubscriber function",
//             errorDetails:err.message
//         }) 
//     }
// }    
async function addSubscriber(req,res){
    console.log("Val of req.body is:",req.body);
    try{
        const uploadUser={
            email:req.body.emailId,
            favSport:req.body.interestedSport,
            interestedClg:req.body.interestedCollege,
        }
        const isUserAlreadyPresent=await subscribedUserCollection.find({email:req.body.emailId});//if present array having obj in index 0
        if(isUserAlreadyPresent.length == 0){
            console.log("inside length >0 :",isUserAlreadyPresent);
            const addedSubscriber=await subscribedUserCollection.create(uploadUser);
            res.send({
                message:"subscriber added successfully..",
                successNotification:true,
                subscriberDetails:addedSubscriber,
                isUserAlreadyPresent:isUserAlreadyPresent,
           })
        }else{
            console.log("inside else block :",isUserAlreadyPresent);
            res.send({
                message:"Email is already used.",
                successNotification:false,
                isUserAlreadyPresent:isUserAlreadyPresent,
            })
        }
        
    }catch(err){
        console.log("Error in addSubscriber function..",err);
        res.send({
            message:"error in addSubscriber function",
            errorDetails:err.message
        })
    }

}

module.exports=subscribedUserRouter;