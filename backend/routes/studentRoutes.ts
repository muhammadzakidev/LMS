import { Router } from "express";
import {
  enrollCourse,
  getUploadedCourse,
  getMyCourse,
  getCourseById,
  completeLesson,
} from "../controllers/enrollmentController.ts";
import { getAuth } from "../middleware/authMiddleware.ts";
import { allowRole } from "../middleware/roleMiddleware.ts";
import { generateCertificate } from "../controllers/certificateController.ts";
const router = Router();
router.post("/courses/:courseId/enroll", getAuth, allowRole("Students"), enrollCourse);
router.get("/courses", getAuth, allowRole("Students"), getUploadedCourse);
router.get("/myCourse", getAuth, allowRole("Students"), getMyCourse);
router.get("/courses/:courseId", getAuth, allowRole("Students"), getCourseById);
router.post("/courses/:courseId/lessons/:lessonId/complete", getAuth, allowRole("Students"), completeLesson);
router.post("/courses/:courseId/certificate", getAuth , allowRole("Students"),generateCertificate);
export default router;
