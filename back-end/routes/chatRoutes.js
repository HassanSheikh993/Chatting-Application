import express from "express";
import { accessChat,fetchChats,createGroupChat,renameGroup, addToGroup, groupRemove } from "../controllers/chatControllers.js";
import { auth } from "../customMiddleWare/authMiddleWare.js";
export const chatRouter = express.Router();

chatRouter.post("/",auth,accessChat);
chatRouter.get("/",auth,fetchChats);
chatRouter.post("/group",auth,createGroupChat);
chatRouter.post("/update",renameGroup);
chatRouter.put("/groupadd",addToGroup)
chatRouter.delete("/groupRemove",groupRemove)