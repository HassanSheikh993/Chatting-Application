import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();
const url = process.env.MONGO_URL;

export const connectDB = async ()=>{
   await mongoose.connect(url).then(()=>console.log("Connected to DB"))
                 .catch((err)=>console.log(`Error while connecting with DB ${err}`));
}

