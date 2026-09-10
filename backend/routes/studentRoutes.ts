import {Router} from "express";
import { enrollCourse, getUploadedCourse } from "../controllers/enrollmentController.ts";
import { getAuth } from "../middleware/authMiddleware.ts";
import { allowRole } from "../middleware/roleMiddleware.ts";

const router = Router();
router.post("/courses/:courseId/enroll", getAuth,allowRole("Students"),enrollCourse);
router.get("/courses", getAuth, allowRole("Students"),getUploadedCourse);
export default router ;