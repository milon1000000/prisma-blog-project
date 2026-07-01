import  httpStatus  from 'http-status';
import express,{ Application, NextFunction, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import cookieParser from "cookie-parser";
import { UserRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comment/comment.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { subscriptionRoutes } from './modules/subscription/subscription.route';
const app:Application=express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(cors({
    origin:config.app_url,
    credentials:true
}));


app.get("/",(req:Request,res:Response)=>{
    res.send("Hello World")
})


app.use("/api/users",UserRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/comments",commentRoutes);
app.use("/api/subscription",subscriptionRoutes)

// app.use((req:Request,res:Response)=>{
//     res.status(404).json({
//         message:"Route not found",
//         path:req.originalUrl,
//         date:Date()
//     })
// })

app.use(notFound);

// app.use((err:any,req:Request,res:Response,next:NextFunction)=>{
//     console.log(err)
//      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//         success:false,
//         statusCode:httpStatus.INTERNAL_SERVER_ERROR,
//         message:err.message,
//         error:err.stack
//     })
// })

app.use(globalErrorHandler)


export default app;