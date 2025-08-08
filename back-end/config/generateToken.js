import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.JWT_SECRET)
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

