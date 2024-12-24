import express from "express"
import {signup, login, logout, updateProfile} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/signup", signup);

router.get("/login", login);

router.get("/logout", logout);

router.get("/update-profile", protectRoute, updateProfile);


export default router;