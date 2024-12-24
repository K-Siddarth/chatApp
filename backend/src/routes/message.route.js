import express from "express"
import {signup, login, logout, updateProfile} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersSidebar } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/user", protectRoute, getUsersSidebar);

router.get("/:id", protectRoute, getMessages);

router.get("/send/:id", protectRoute);

router.get("/update-profile", protectRoute, updateProfile);


export default router;