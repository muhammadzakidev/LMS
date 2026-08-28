import {Request , Response, Router} from 'express'
import {allowRole, instructorOnly} from '../middleware/roleMiddleware.ts'
import {getAuth} from '../middleware/authMiddleware.ts'


const router = Router();

router.get('/dashboard' , getAuth , allowRole("Instructor") ,instructorOnly, (req:Request &{user?: unknown} , res:Response)=>{
    res.status(200).json({
        success: true ,
        message: 'Yes Instructor route is valid..',
        user: req.user
        
    })
} );

export default router
