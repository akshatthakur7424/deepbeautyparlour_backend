import { db } from "../../database/database.js"; // Prisma client
import { hashPassword } from "../../utils/hashedPassword.js";
import { verifyJWT } from "../../utils/verifyJWT.js";
import dotenv from "dotenv";
dotenv.config();

const passwordController = async (req, resp) => {
  const tokenValue = req.cookies.token;
  const srkKey = process.env.JWT_SECRET || "asdfasdjaperofspdkfneirfpsdferifskdnfiri";

  try {
    const JWTemail = verifyJWT(tokenValue, srkKey);
    if (!JWTemail) {
      return resp.status(401).json({ message: "Invalid token" });
    }

    console.log("Saving password of", JWTemail);

    const plainPassword = req.body.password;

    // Hashing the new password
    const hashedPassword = await hashPassword(plainPassword);

    // Updating the password in the database via Prisma
    await db.user.update({
      where: { email: JWTemail },
      data: { password: hashedPassword },
    });

    console.log("Password hashed and saved in the database.");
    return resp.status(200).json({
      response: "Password encrypted and saved to database successfully.",
    });

  } catch (error) {
    console.error("Error in passwordController:", error);
    return resp.status(500).json({
      message: "Failed to update password",
      error: error.message,
    });
  }
};

export { passwordController };
