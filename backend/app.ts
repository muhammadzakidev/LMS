import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/auth.ts";
import userRouter  from './routes/userRoutes.ts'
import instructorRoute from './routes/instructorRoutes.ts'
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from './upload/uploadthing.ts';

const app = express();

app.use(cors({
   origin: "http://localhost:3000",
   credentials: true,
}));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use("/api/uploadthing", createRouteHandler({
  router: uploadRouter,
}));
app.use("/api/student", userRouter);
app.use("/api/instructor", instructorRoute );

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
