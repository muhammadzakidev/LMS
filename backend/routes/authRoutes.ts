import authController from '../controllers/authController.ts'
import {Router} from 'express'

const router = Router();
router.get('/', authController);

export default router