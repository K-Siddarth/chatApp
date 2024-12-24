import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(8000, () => {
    console.log(`Listening at ${PORT}`);
    connectDB();
});