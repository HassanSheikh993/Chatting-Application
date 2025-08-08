import express from "express";
import { upload } from "../customMiddleWare/multerMiddleWare.js";
import { registerUser,authUser, allUser } from "../controllers/userController.js";
import { auth } from "../customMiddleWare/authMiddleWare.js";


export const router = express.Router();

router.post("/login",authUser);
router.post("/", upload.single("file"), registerUser);
router.get("/allUsers",auth,allUser);



