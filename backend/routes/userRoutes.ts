import {Router} from 'express'
import {getAuth} from '../middleware/authMiddleware.ts' ;
import {Request , Response} from 'express'


const router = Router();

router.get('/profile' , getAuth , (req: Request & { user?: unknown } , res:Response)=>{
    res.status(200).json({
        success: true ,
        message: 'Access Profile Successfully',
        user: req.user

    })
})

export default router