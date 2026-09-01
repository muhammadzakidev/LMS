import  {Request , Response , NextFunction} from 'express'
export const instructorOnly = (req: Request , res: Response , next: NextFunction) =>{

    const user = (req as any).user
    if(!user)
    {
        return res.status(401).json({
            success: false ,
            message: "Authentication is required"
        });
    }
    if(user.role !=="Instructor")
    {
        return res.status(403).json({
            success: false ,
            message: "Instructor access required"
        });
    }
    next();
}

type Role = "Students" | "Instructor"

export const allowRole = (role: Role)=> {
    return (req: Request , res: Response , next: NextFunction) => {
        const user = (req as any).user
        if(!user)
        {
            return res.status(401).json({
                success: false ,
                message: "Authentication is required"
            })
        }
        if(user.role !== role)
        {
            return res.status(403).json({
                success: false ,
                message: `${role} access required`
            })
        }
        next()
    }

}