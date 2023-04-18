const nodemailer=require("nodemailer");

const sendVerificationMail = (mailId, url) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PSD,
      },
    });
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: mailId,
      subject: `Verification mail from Sport Event Team`,
      html: `<h1>Greetings from Chirran of sport event management..!</h1>
                   <h4>Click to Verify your email:
                   ${url}
                   </h4>
                   <h3>Thank you</h3>
                   <h5>Chittaranjan</h5>
                   <h6>Management Team</h6>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(
          "Error inside transporter.sendMail function & error is:",
          error
        );
      } else {
        console.log("Email sent & info.resposne is:" + info.response);
        console.log("Val of info is:", info);
        return info;
      }
    });
  } catch (err) {
    console.log("Error in sendMailToSubscriber function ..", err.message);
    return err.message;
  }
};
module.exports = sendVerificationMail;
