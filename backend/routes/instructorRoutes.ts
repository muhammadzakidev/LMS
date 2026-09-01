import { Request, Response, Router } from "express";
import { allowRole, instructorOnly } from "../middleware/roleMiddleware.ts";
import { getAuth } from "../middleware/authMiddleware.ts";
import {
  createCourse,
  getMyCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  updateCourseStatus,
} from "../controllers/courseController.ts";

const router = Router();

router.get(
  "/dashboard",
  getAuth,
  allowRole("Instructor"),
  instructorOnly,
  (req: Request & { user?: unknown }, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Yes Instructor route is valid..",
      user: req.user,
    });
  },
);
router.post("/courses", getAuth, allowRole("Instructor"), createCourse);
router.get("/courses", getAuth, allowRole("Instructor"), getMyCourse);
router.get("/courses/:id", getAuth, allowRole("Instructor"), getCourseById);
router.patch("/courses/:id", getAuth, allowRole("Instructor"), updateCourse);
router.delete("/courses/:id", getAuth, allowRole("Instructor"), deleteCourse);
router.patch(
  "/courses/:id/status",
  getAuth,
  allowRole("Instructor"),
  updateCourseStatus,
);
export default router;
