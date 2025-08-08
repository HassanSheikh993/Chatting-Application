import { Chat } from "../modles/chatsModel.js";
import { Message } from "../modles/messageModel.js";
import { User } from "../modles/userModel.js";

export const sendMessage = async(req,res)=>{
  const {content,chatId} = req.body;
  if(!content && !chatId){
    console.log("Invalid data passed in request")
    return res.status(400); 
  }

  let newMessage = {
    sender:req.user.id,
    content:content,
    chat:chatId
  }

  try{
    let message = await Message.create(newMessage)
    message =await message.populate("sender","name pic")
    message =await message.populate("chat");
    message = await User.populate(message,{
        path:"Chat.users",
        select:"name email pic"
    })





    await Chat.findByIdAndUpdate(chatId,{
        latestMessage:message
    })

    res.status(200).json(message)

  }catch(err){
    console.log("Error in sendMessage ",err);
    res.status(500);
  }


}

export const allMessage = async (req,res)=>{

  try{
       let messages = await Message.find({chat:req.params.chatId}).populate("sender","name email pic").populate("chat");
      res.status(200).json(messages)
  }catch(err){
    console.log("Error in allMessage ",err);
    res.status(500)
  }
  
}


