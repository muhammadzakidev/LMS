import express from 'express' ;
import { createLesson, getLesson } from '../controllers/LessonController.ts';
import { getAuth } from '../middleware/authMiddleware.ts';
import { allowRole } from "../middleware/roleMiddleware.ts";
const router = express.Router();

router.post(
  "/courses/:courseId/modules/:moduleId/lessons",
  getAuth,
  allowRole("Instructor"),
  createLesson
);
router.get(
  "/courses/:courseId/modules/:moduleId/lessons",
  getAuth,
  allowRole("Instructor"),
  getLesson
);
export default router;