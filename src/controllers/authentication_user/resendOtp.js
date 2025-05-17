import { db } from "../../database/database.js"; // Prisma client
import { generateRandomCode } from "../../utils/generateOtp.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { verifyJWT } from "../../utils/verifyJWT.js";
import dotenv from "dotenv";
dotenv.config();

const resendOtpController = async (req, resp, next) => {
  const tokenValue = req.cookies.token;
  const srkKey = process.env.JWT_SECRET || "asdfasdjaperofspdkfneirfpsdferifskdnfiri";

  try {
    const JWTemail = verifyJWT(tokenValue, srkKey);
    if (!JWTemail) {
      return resp.status(401).json({ message: "Invalid token" });
    }

    console.log("Resending OTP to", JWTemail);

    // Generate a new OTP
    const newOtp = generateRandomCode();

    // Update OTP in the database using Prisma
    const updatedUser = await db.user.update({
      where: { email: JWTemail },
      data: { otp: newOtp },
    });

    console.log(`${newOtp} : OTP updated in the database for ${JWTemail}`);

    // Send OTP via email
    await sendEmail(JWTemail, newOtp);

    const data = {
      "resendOtp Message": "Another OTP has been resent to the same email successfully.",
    };

    resp.status(200).json(data);
    next();

  } catch (error) {
    console.error("Error in resendOtpController:", error);
    resp.status(500).json({
      message: "Failed to resend OTP",
      error: error.message,
    });
  }
};

export { resendOtpController };
