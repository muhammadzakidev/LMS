import express from 'express';
import { createModule , getModules, updateModule, deleteModule } from '../controllers/moduleController.ts';

import { getAuth } from '../middleware/authMiddleware.ts';
import { allowRole } from '../middleware/roleMiddleware.ts';
const router = express.Router();
router.post("/courses/:courseId/modules", getAuth, createModule,allowRole("Instructor"));
router.get("/courses/:courseId/modules", getAuth,allowRole("Instructor"),getModules);
router.patch("/courses/:courseId/modules/:moduleId", getAuth, allowRole("Instructor"), updateModule);
router.delete( "/courses/:courseId/modules/:moduleId",getAuth , allowRole("Instructor"), deleteModule)
export default router