import {Request , Response , NextFunction} from 'express'
import {auth} from '../auth/auth.ts'



export const getAuth = async(req: Request , res: Response , next: NextFunction) =>{
   try {
       const session = await auth.api.getSession({
        headers: req.headers as Record<string , string>,
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