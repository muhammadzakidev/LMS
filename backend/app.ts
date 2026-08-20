import express, {Request , Response} from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './routes/authRoutes.ts'
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/user' , userRouter);
const PORT = process.env.PORT || 5000 ;
app.listen(PORT , ()=>{
  console.log(`server is running on this ${PORT}`)
})







