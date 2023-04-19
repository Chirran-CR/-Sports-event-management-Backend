const express=require("express");
const crypto=require("crypto");

const subscribedUserRouter=express.Router();
const subscribedUserCollection=require("../model/subscribed-user-model");
const tempSubscribedUserCollection = require("../model/tempSubscribed-user-model");
const tokenCollection = require("../model/token-model");
const sendVerificationMail = require("../utils/mailFunctions");
console.log("inside subscribed user router");


subscribedUserRouter
    .route("/add")
    .post(addSubscriber)
subscribedUserRouter
    .route("/:id/verify/:token")
    .get(verifyEmailForSubscription)
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
async function verifyEmailForSubscription(req,res){
    try{
      const user=await tempSubscribedUserCollection.findOne({_id:req.params.id});
      console.log("Val of user is:",user);

    //   if(!user) return res.status(400).send({message:"Invalid Link"});
    if (!user) return res.sendFile(__dirname+'/htmlPages/failedScreen.html');

      const token = await tokenCollection.findOne({
        userId: user._id,
        token: req.params.token,
      });
      console.log("Val of token inside verifyEmailForSubscription is:",token);

    //   if (!token) return res.status(400).send({ message: "Invalid link for token" });
    // if (!token) return res.render("failedScreen",{name:"Haresh",message:"Invalid Link for token"});
    if (!token) return res.sendFile(__dirname+'/htmlPages/failedScreen.html');
      
    const uploadUser={
        email:user.email,
        favSport:user.favSport,
        interestedClg:user.interestedClg,
    }
    const subUserDetails= await subscribedUserCollection.create(uploadUser);
      await token.remove();
      await user.remove();
       console.log("Val of subUserDetails is:",subUserDetails);
    //   res.status(200).send({ message: "Email verified successfully" });
    //   res.render("successfulScreen",{name:"Haresh"});
    res.sendFile(__dirname+'/htmlPages/successfulScreen.html');
    }catch(err){
    //   res.send({//to show the error in frontend becz request full fill nhi ho rha h status code 404 add karne par
    //     message:"Error in verifyEmailForRegistration function",
    //     errorMessage:err.message,
    //     myError:true
    //   })
    console.log("Val of error msg inside verifyEmailRegistration fn is:",err.message);
     res.sendFile(__dirname+'/htmlPages/failedScreen.html');
    //  res.render("failedScreen",{name:"Haresh",message:"Error in verifyEmailForRegistration function"})
    }
}

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
            console.log("inside length ==0 :",isUserAlreadyPresent);
            //TODO- first create a tempSubUser then send verification mail
            //todo- send verification mail
            //todo- then on successful verification add user to subDB
            // const addedSubscriber=await subscribedUserCollection.create(uploadUser);
            const addedTempSubscriber=await tempSubscribedUserCollection.create(uploadUser);

        //     res.send({
        //         message:"subscriber added successfully..",
        //         successNotification:true,
        //         subscriberDetails:addedSubscriber,
        //         isUserAlreadyPresent:isUserAlreadyPresent,
        //    })
        const token=await new tokenCollection({
            userId:addedTempSubscriber._id,
            token:crypto.randomBytes(32).toString("hex"),
        }).save();  
        console.log("addedTempSubscriber in addSubscriber fn is:",addedTempSubscriber);
        const url=`${process.env.BASE_URL}/subscribe/${addedTempSubscriber._id}/verify/${token.token}`;
        await sendVerificationMail(addedTempSubscriber.email,url);
       
                res.send({
                    message:"temp subscriber added successfully..",
                    successNotification:false,
                    sendMail:true,
                    tempSubscriberDetails:addedTempSubscriber,
                    isUserAlreadyPresent:isUserAlreadyPresent,
            })
        }else{
            console.log("inside else block :",isUserAlreadyPresent);
            res.send({
                message:"Email is already used.",
                sendMail:false,
                successNotification:false,
                isUserAlreadyPresent:isUserAlreadyPresent,
            })
        }
        
    }catch(err){
        console.log("Error in addSubscriber function..",err);
        res.send({
            message:"error in addSubscriber function",
            sendMail:false,
            successNotification:false,
            errorDetails:err.message
        })
    }

}

module.exports=subscribedUserRouter;