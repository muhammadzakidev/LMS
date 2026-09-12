import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/auth.js";
import instructorRoute from './routes/instructorRoutes.js';
import { createRouteHandler } from "uploadthing/express";
// cspell:disable-next-line
import { uploadRouter } from "./upload/uploadthing.js";
import moduleRouter from "./routes/moduleRoutes.js";
import lessonRouter from './routes/lessonRoutes.js';
import studentRouter from './routes/studentRoutes.js';
const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
// cspell:disable-next-line
app.use("/api/uploadthing", createRouteHandler({
    router: uploadRouter,
}));
app.use("/api/student", studentRouter);
app.use("/api/instructor", instructorRoute);
app.use("/api/instructor", moduleRouter);
app.use("/api/instructor", lessonRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
