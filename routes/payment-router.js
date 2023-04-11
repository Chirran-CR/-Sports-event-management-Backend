const express=require("express");
const Stripe=require("stripe")(process.env.STRIPE_SECRET_KEY);
const paymentRouter=express.Router();

console.log("inside payment router");

// (async function  paymethodFn(){
//   const paymentMethod = await Stripe.paymentMethods.create({
//     type: 'card',
//     id: "pi_1Dt1sb2eZvKYlo2CEaM1ZUhw",
//     card: {
//       number: '4242424242424242',
//       exp_month: 7,
//       exp_year: 2027,
//       cvc: '314',
//     },
//   });
//   let customerId="3e4r3e5rfedfsdgtretagdfdaf";
//   const paymentMethodAttach = await Stripe.paymentMethods.attach(paymentMethod.id, {
//     customer: customerId,
//   });

// })();

paymentRouter
    .route("/")
    .post(checkPayment)

    
async function checkPayment(req,res){
      let status, error;
      const { token, amount } = req.body;
    console.log("Val of token is:",token);
    let stripeSite="";
    try {
      // await Stripe.charges.create({
        //   source: token.id,
        //   amount,
        //   currency: 'inr',
        // });
        // const paymentMethod = await Stripe.paymentMethods.create({
        //   type: 'card',
        //   card: {
        //     number: '4242424242424242',
        //     exp_month: 7,
        //     exp_year: 2027,
        //     cvc: '314',
        //   },
        // });
        const paymentIntent= await Stripe.paymentIntents.create({
          // source:token.id,
          amount: amount,
          currency: 'inr',
          payment_method_types:['card'],
          confirmation_method: 'manual',
          // confirm: true,
          // automatic_payment_methods: {enabled: true},
        });
        console.log("Val of paymentIntent:",paymentIntent);
        const paymentMethod = await Stripe.paymentMethods.create({
          type: 'card',
          card: {
            number: '4242424242424242',
            exp_month: `${token.card.exp_month}`,
            exp_year: `${token.card.exp_year}`,
            cvc: '314',
          },
        });
        console.log("Val of paymentMethod is:",paymentMethod);
        const customer = await Stripe.customers.create({
          description: 'My First Test Customer (created for sport event test)',
        });
        console.log("Val of customer is:",customer);

        const paymentMethodAttach = await Stripe.paymentMethods.attach(
          paymentMethod.id,
          {customer: customer.id}
        );
        console.log("Val of paymethodAttach is:",paymentMethodAttach);
        const paymentIntentConfirm = await Stripe.paymentIntents.confirm(
          paymentIntent.id,
          {payment_method: 'pm_card_visa',
          use_stripe_sdk:true}
          // {payment_method: paymentMethod.id}
        );
        console.log("Val of paymentIntentConfirm is:",paymentIntentConfirm);
        //paymentIntentConfirm.next_action.use_stripe_sdk.stripe_js
        stripeSite= paymentIntentConfirm.next_action.use_stripe_sdk.stripe_js;
        
        status = 'success';
      } catch (error) {
      console.log(error);
      status = 'Failure';
    }
    res.json({ error, status,site:stripeSite });
}
module.exports=paymentRouter;