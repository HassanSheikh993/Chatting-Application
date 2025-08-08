import express from "express";
import { sendMessage,allMessage } from "../controllers/messageController.js";

import { auth } from "../customMiddleWare/authMiddleWare.js";

export const msgRouter = express.Router();

msgRouter.post("/",auth,sendMessage);
msgRouter.get("/:chatId",allMessage)