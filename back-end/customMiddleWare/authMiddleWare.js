import jwt from "jsonwebtoken"
import { User } from "../modles/userModel.js"
import dotenv from "dotenv";

dotenv.config()
export const auth = async(req,res,next)=>{
try{
        const token = req.cookies.token;
    console.log("Auth Token: ",token);

    if(!token){
        return res.status(401).json({message:"Access Denied. Need to login"})
    }

    const SecretKey = process.env.JWT_SECRET;

    const decode = jwt.verify(token,SecretKey);
    // console.log("Decoded Value: ",decode);

    const validUser = await User.findOne({_id:decode.id});
    // console.log("ValidUser: ",validUser);

if(!validUser){
    return res.status(404).json({message:"user not found"})
}

    req.user = decode;
    next()
}catch(err){
    console.log("Error in authMiddleWare: ",err);
    return res.status(500).json({message:"Invalid or expire token"})
}
}