import { db } from '../../database/database.js'; // Prisma client
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const loginController = async (req, resp) => {
  const userEmail = req.body.email;
  console.log("User Entered Email = ", userEmail);

  try {
    // Prisma way of fetching user by email
    const user = await db.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      const data1 = {
        message: "User Not found in Database",
      };
      console.log(data1);
      return resp.status(404).json(data1);
    }

    // JWT payload
    const payload = { email: user.email };
    const securityKey = process.env.JWT_SECRET || "default_jwt_secret";
    const token = jsonwebtoken.sign(payload, securityKey, {
      expiresIn: "1h", // optional: set token expiration
    });

    const data2 = {
      message: "User found in Database",
      token: token,
    };
    return resp.status(200).json(data2);

  } catch (error) {
    console.error("Error in loginController:", error);
    return resp.status(500).json({ message: "Internal server error" });
  }
};

export default loginController;
