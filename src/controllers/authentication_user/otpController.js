import { db } from "../../database/database.js"; // Prisma client
import { verifyJWT } from "../../utils/verifyJWT.js";
import dotenv from "dotenv";
dotenv.config();

const otpController = async (req, resp) => {
  const tokenValue = req.cookies.token;
  const userEnteredOtp = req.body.otp;

  const srkKey = process.env.JWT_SECRET || "asdfasdjaperofspdkfneirfpsdferifskdnfiri";

  try {
    const JWTemail = verifyJWT(tokenValue, srkKey);
    if (!JWTemail) {
      console.log("Invalid JWT.");
      return resp.status(401).json({ status: "error", message: "Invalid token" });
    }

    console.log("Checking OTP given by", JWTemail);

    // Prisma query to fetch user by email
    const user = await db.user.findUnique({
      where: { email: JWTemail },
    });

    if (!user) {
      return resp.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.otp === userEnteredOtp) {
      console.log("OTP Matched");
      return resp.status(200).json({
        status: "success",
        message: "OTP matched successfully.",
      });
    } else {
      console.log("Incorrect OTP");
      console.log(`User Entered OTP: ${userEnteredOtp}, Stored OTP: ${user.otp}`);
      return resp.status(401).json({
        status: "error",
        message: "Invalid OTP. Please try again.",
      });
    }

  } catch (error) {
    console.error("Error in otpController:", error);
    return resp.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export { otpController };
