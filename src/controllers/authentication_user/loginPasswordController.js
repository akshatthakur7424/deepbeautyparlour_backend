import bcrypt from "bcrypt";
import { verifyJWT } from "../../utils/verifyJWT.js";
import dotenv from "dotenv";
import { db } from "../../database/database.js"; // Prisma client import
dotenv.config();

const loginPasswordController = async (req, resp) => {
  const userEnteredPassword = req.body.password;
  const tokenValue = req.cookies.token;

  const srkKey = process.env.JWT_SECRET || "asdfasdjaperofspdkfneirfpsdferifskdnfiri";

  try {
    const JWTemail = verifyJWT(tokenValue, srkKey);
    if (!JWTemail) {
      return resp.status(401).json({ message: "Invalid token" });
    }

    // Prisma query to find user by email
    const user = await db.user.findUnique({
      where: { email: JWTemail },
    });

    if (!user) {
      console.log("User not found in DB");
      return resp.status(404).json({ message: "User not found" });
    }

    const storedPassword = user.password;
    console.log("Password in Database:", storedPassword);
    console.log("User Entered Password:", userEnteredPassword);

    const isMatch = await bcrypt.compare(userEnteredPassword, storedPassword);

    if (isMatch) {
      console.log("Password is correct");
      return resp.status(200).json({ message: "Correct Password" });
    } else {
      console.log("Password is incorrect");
      return resp.status(401).json({ message: "Incorrect Password" });
    }

  } catch (error) {
    console.error("Error in loginPasswordController:", error);
    return resp.status(500).json({ message: "Internal server error" });
  }
};

export { loginPasswordController };
