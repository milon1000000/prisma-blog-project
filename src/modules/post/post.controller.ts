import  httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";


const createPost=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const id=req.user?.id;
    const payload=req.body;
    const result=await postService.createPost(payload,id as string);


    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"Post created successfully",
        data:result
    })
})

const getAllPosts=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
   const result=await postService.getAllPosts();

   sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"Posts Retrived Successfully",
    data:result
   })
})

export const postController={
    createPost,
    getAllPosts
}