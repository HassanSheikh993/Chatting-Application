import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String,required:true},
    pic:{type:String, required:true, default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
},{
    timestamps:true
})



/*
methods is a mongoose object that lets you define custom instance methods for documents.
matchPassword becomes a function that every user document can use.
So when you fetch a user from the database, you can call user.matchPassword() to compare passwords.
*/

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}




userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next(); 
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next(); 
});



export const User = mongoose.model("User",userSchema);