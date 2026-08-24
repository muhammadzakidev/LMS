import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import userRouter from "./routes/authRoutes.js";
import { auth } from "./auth/auth.js";
const app = express();
app.use(cors());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use("/api/user", userRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
