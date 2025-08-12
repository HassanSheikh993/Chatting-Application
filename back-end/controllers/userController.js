import { User } from "../modles/userModel.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../config/generateToken.js";
// registration part
export const registerUser = async(req,res)=>{
   try{
     const { name, email, password, confirmPassword, pic } = req.body;
     const file = req.file;
  

    if(!name || !email || !password || !confirmPassword){
      return res.status(400).json({message:"Incomplete Data"})
    }

    if(password !== confirmPassword){
        return res.status(400).json({message:"Password do not match"})
    }

    const userExist = await User.findOne({email});
    if(userExist){
       return res.status(400).json({message:"User already exists"})
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    })

    if(user){
        res.status(201).json({
            name:user.name,
            email:user.email,
            password:user.password,
            pic:user.pic
        })
    }
   }catch(err){
    console.log("ERROR while register user : ",err);
   res.status(500).json({ message: "Error while registering user" });

   }

}



/// login part

export const authUser = async(req,res)=>{
  try{
      const {email,password}  = req.body;
     
    if(!email || !password){
        return res.status(400).json({message:"Incomplete Data"})
    }
    const userExist = await User.findOne({email});

    if(!userExist){
        return res.status(404).json({message:"user not found"})
    }
    
/*
we did userExist.matchPassword(password) not User.matchPassword(password)
because User is the Model, not a single user.
matchPassword is an instance method, specific to particular user not the whole model "User"
*/

 const isMatch = await userExist.matchPassword(password);
 console.log(isMatch)
 if(!isMatch){
    return res.status(401).json({message:"Incorrect Password"})
 }

const token = generateToken(userExist._id);

res.cookie("token", token, {
  httpOnly: true,
  secure: false, // 🔁 set true if using HTTPS (e.g., in production)
  sameSite: "lax", // 🔁 or "None" if cross-origin and using HTTPS
  maxAge: 30 * 24 * 60 * 60 * 1000, // optional: 30 days
});

  res.status(200).json({
            _id:userExist._id,
            name:userExist.name,
            email:userExist.email,
            pic:userExist.pic
        })


  }catch(err){
    console.log("Error in authUser ",err);
    res.status(500).send("Error while login")
  }
} 


// all users
export const allUser = async (req,res)=>{
  console.log(req.query.search)

  const keyword = req.query.search?
  {
    $or:[
      {name:{$regex:req.query.search, $options:"i"}},
      {email:{$regex:req.query.search, $options:"i"}}
    ]
  } : {};

  const result = await User.find(keyword).find({_id:{$ne:req.user.id}});
 console.log(result)
  if(result){
    return res.status(200).json(result)
  }
  res.status(404).send("nothing")
  
}