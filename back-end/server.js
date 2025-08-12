import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { router } from "./routes/userRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { chatRouter } from "./routes/chatRoutes.js";
import { msgRouter } from "./routes/messageRoute.js";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();

const app = express();
const port = process.env.PORT;

const server = new createServer(app);

const io = new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    credentials: true,
  }
})

connectDB();

app.use(cookieParser());
app.use(cors({
     origin: "http://localhost:5173",
  credentials: true 
}))
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use("/api/user/",router)
app.use("/api/chat/",chatRouter)
app.use("/api/msg/",msgRouter)


// io.on("connection",(socket)=>{
//   console.log("Connected to Socket.io");

//   socket.on("setUp",(userData)=>{
//     socket.join(userData)
//     console.log(userData._id," ",userData.name)
//     socket.emit("user joined")
//   })
 
//   let roomId = "";
//   socket.on("joinChat",(room)=>{
//     socket.join(room._id);
//     roomId = room._id;
//     console.log("user join room ",room._id)
//   })

//   socket.on("newMessage",(data)=>{
//     io.to(roomId).emit("receiveMessage", data);
//   })
// })


io.on("connection",(socket)=>{
  console.log("socket Connected...")

  socket.on("join room",(data)=>{
    socket.join(data._id);
    console.log("user have join room: ", data._id)
    
  })

  socket.on("new message",(data)=>{
    const chat = data.chat;
    if (!chat || !chat._id) return;
    socket.to(chat._id).emit("message received", data);

  })



  socket.on("update latest message", (newMessage) => {
  socket.in(newMessage.chat._id).emit("latest message updated", newMessage);
  socket.emit("latest message updated", newMessage); 
});
  
})




server.listen(port,()=>{
    console.log(`Server started at port ${port}`)
})