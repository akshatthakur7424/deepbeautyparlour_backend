import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (email, otpNumber, resp) => {
  // const ownerEmail = process.env.OWNER_EMAIL;
  // const ownerEmailPassword = process.env.OWNER_EMAIL_PASSWORD;
  const ownerEmail = "";   // Enter your email in the parenthesis
  const ownerEmailPassword = "";  // Enter your nodemailer password in the parenthesis
  console.log("Owner Email comming from environment variables : ", ownerEmail);
  console.log("Owner EMail Password coming from environment variables : ", ownerEmailPassword);

  let emailSendingData = {
    service: "gmail",
    auth: {
      user: ownerEmail,
      pass: ownerEmailPassword,
    }
  };

  // Sending Email
  const transporter = nodemailer.createTransport(emailSendingData);

  const mailOptions = {
    from: ownerEmail,
    to: email,
    subject: "Email Verification",
    html: `<h3>This is your otp</h3> ${otpNumber}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending mail : ", error);
    } else {
      console.log(
        "Email Sent Successfully : ",
        info.response,
        "OTP Number : ",
        otpNumber
      );
      resp.status(201).send(info);
    }
  });
};

export { sendEmail };



