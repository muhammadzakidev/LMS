import {Router} from "express";
import { enrollCourse, getUploadedCourse, getMyCourse, getCourseById } from "../controllers/enrollmentController.ts";
import { getAuth } from "../middleware/authMiddleware.ts";
import { allowRole } from "../middleware/roleMiddleware.ts";

const router = Router();
router.post("/courses/:courseId/enroll", getAuth,allowRole("Students"),enrollCourse);
router.get("/courses", getAuth, allowRole("Students"),getUploadedCourse);
router.get("/myCourse", getAuth, allowRole("Students"), getMyCourse);
router.get("/courses/:courseId", getAuth, allowRole("Students"), getCourseById);
export default router ;