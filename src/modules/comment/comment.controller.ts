import httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";

const createComment=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
const authorId=req.user?.id;
const payload=req.body;

 if (!authorId) {
      throw new Error("Unauthorized");
    }

const result=await commentService.createComment(payload,authorId as string);

sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"Comment create successfully!",
    data:result
})

})

const getCommentByAuthorId=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
      const authorId=req.params.authorId;

      const result=await commentService.getCommentByAuthorId(authorId as string);

      sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Comments retrieved successfully",
        data:result
      })
})

const getCommentByCommentId=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const commentId=req.params.commentId;

    const result=await commentService.getCommentByCommentId(commentId as string);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Comments retrieved successfully",
        data:result
    })
})

const updateCommentByCommentId=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const payload=req.body;
  const authorId=req.user?.id;
  const commentId=req.params.commentId;
  const isAdmin=req.user?.role==="ADMIN";

  if(!authorId){
    throw new Error("Unauthorized");
  }

  const result=await commentService.updateCommentByCommentId(payload,authorId as string,commentId as string,isAdmin);

  sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"Comment update successfully",
    data:result
  })
})

const deleteCommentByCommentId=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const authorId=req.user?.id;
  const commentId=req.params.commentId;
  const isAdmin=req.user?.role ==="ADMIN";

  if(!authorId){
    throw new Error("Unauthorized");
  };

  await commentService.deleteCommentByCommentId(authorId as string,commentId as string,isAdmin);
  sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"Comment delete successfully",
    data:null
  })
});

const adminModerate = catchAsync(
 async (req: Request, res: Response, next: NextFunction) => {
  const commentId = req.params.commentId;
  const isAdmin = req.user?.role === "ADMIN";

  const { status } = req.body;

  const result = await commentService.adminModerate(
    commentId as string,
    isAdmin,
    status
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment moderated successfully",
    data: result,
  });
});

export const commentController={
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateCommentByCommentId,
    deleteCommentByCommentId,
    adminModerate
}