import express,{ Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import cookieParser from "cookie-parser";
import { UserRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comment/comment.route";
const app:Application=express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

app.get("/",(req:Request,res:Response)=>{
    res.send("Hello World")
})


app.use("/api/users",UserRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/comments",commentRoutes)

app.use(cors({
    origin:config.app_url,
    credentials:true
}))


export default app;