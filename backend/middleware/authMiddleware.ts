import {Request , Response , NextFunction} from 'express'
import {auth} from '../auth/auth.ts'
import { fromNodeHeaders } from 'better-auth/node';


export const getAuth = async(req: Request , res: Response , next: NextFunction) =>{
   try {
       const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers) ,
       });
       if(!session)
       {
          return res.status(401).json({
            success: false ,
            message: "This is Unauthorized person."
          });
       }
      (req as Request & { user: typeof session.user }).user = session.user ;

       next();
   } catch (error) {
      console.log('Error occur during login');
      res.status(401).json({
        success: false,
        message: "Unauthorized" ,
        error: error instanceof Error ? error.message : String(error)
      })
    
   }
}