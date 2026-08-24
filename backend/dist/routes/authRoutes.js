import authController from '../controllers/authController.js';
import { Router } from 'express';
const router = Router();
router.get('/', authController);
export default router;
