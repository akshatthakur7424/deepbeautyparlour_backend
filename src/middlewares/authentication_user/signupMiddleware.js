import { db } from "../database/database.js"; // Prisma client
import { otpNumber } from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const emailSaver = async (req, resp, next) => {
  const { name, email } = req.body;

  try {
    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) {
      console.log({ message: "User already exists, please Login" });
      return resp.status(409).json({ message: "User already exists, please login." });
    }

    await db.user.create({
      data: {
        name,
        email,
      },
    });

    console.log({ message: "User added to database successfully." });
    next();

  } catch (error) {
    console.error("Error adding user:", error);
    return resp.status(500).json({ message: "Cannot add user to the database." });
  }
};

const otpSaver = async (req, resp, next) => {
  const { email } = req.body;

  try {
    await db.user.update({
      where: { email },
      data: { otp: otpNumber },
    });

    console.log({ message: "OTP saved to database successfully." });
    console.log(`${otpNumber} : OTP updated in the database for ${email}`);
    next();

  } catch (error) {
    console.error("Error saving OTP:", error);
    return resp.status(500).json({ message: "Cannot save the generated OTP in the database." });
  }
};

const emailSender = async (req, resp, next) => {
  const { email } = req.body;

  try {
    await sendEmail(email, otpNumber);
    next();
  } catch (error) {
    console.error("Cannot send OTP to email:", error);
    return resp.status(500).json({ message: "Failed to send OTP email." });
  }
};

const generateJWT = async (req, resp, next) => {
  const { email } = req.body;

  try {
    const payload = { email };
    const securityKey = process.env.JWT_SECRET || "asdfasdjaperofspdkfneirfpsdferifskdnfiri";
    const token = jsonwebtoken.sign(payload, securityKey);
    
    console.log("Generated JWT:", token);

    // Attach token to response as a cookie (optional):
    // resp.cookie("token", token, { httpOnly: true });

    resp.status(200).json({ token });
    next();

  } catch (error) {
    console.error("Error generating JWT:", error);
    return resp.status(500).json({ message: "Failed to generate token." });
  }
};

export { emailSaver, otpSaver, emailSender, generateJWT };