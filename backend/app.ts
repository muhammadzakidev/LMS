import express, {Request , Response} from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());



app.get('/api/test' ,(req: Request,res: Response)=>{
    res.json({
        success: true ,
        message: 'Backend API is working'
    });
});

const PORT = process.env.PORT || 5000 ;
app.listen(PORT , ()=>{
  console.log(`server is running on this ${PORT}`)
})







