import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { ICreateCommentPayload, IUpdateCommentPayload } from "./comment.interface"

const createComment=async(payload:ICreateCommentPayload,authorId:string)=>{
 await prisma.post.findUniqueOrThrow({
    where:{
        id:payload.postId
    }
 });
 const result=await prisma.comment.create({
    data:{
     content:payload.content,
      postId:payload.postId,
      authorId
    }
 });
 return result;
}

const getCommentByAuthorId=async(authorId:string)=>{
const comment=await prisma.comment.findMany({
    where:{
        authorId
    },
    include:{
      post:{
        select:{
            id:true,
            title:true,
            comments:true
        }
      },
      author:{
        omit:{
            password:true
        }
      }
    },
    orderBy:{
        createdAt:"desc"
    }
});
return comment;
}

const getCommentByCommentId=async(commentId:string)=>{
    const comment=await prisma.comment.findFirstOrThrow({
        where:{
            id:commentId
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true,
                    comments:true
                }
            },
            author:{
                omit:{
                    password:true
                }
            },
            
        }
    })
    return comment;

}

const updateCommentByCommentId=async(payload:IUpdateCommentPayload,authorId:string,commentId:string,isAdmin:boolean)=>{
    const comment=await prisma.comment.findUniqueOrThrow({
        where:{
            id:commentId
        },
    })
    if(!isAdmin && comment.authorId !==authorId){
         throw new Error("You are not the owner of this comment");
    }

    const result=await prisma.comment.update({
        where:{
            id:commentId
        },
        data:payload
    });
    return result;

}

const deleteCommentByCommentId=async(authorId:string,commentId:string,isAdmin:boolean)=>{
    const comment=await prisma.comment.findUniqueOrThrow({
        where:{
            id:commentId
        }
    });

    if(!isAdmin && comment.authorId !==authorId){
         throw new Error("You are not the owner of this comment");
    }

    await prisma.comment.delete({
        where:{
            id:commentId
        }
    });
    return null;

}

const adminModerate = async (
  commentId: string,
  isAdmin: boolean,
  payload: CommentStatus
) => {

  if (!isAdmin) {
    throw new Error("Only admin can access");
  }

  await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });

  const result = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      status: payload,
    },
    include:{
        author:{
            omit:{
                password:true
            }
        },
        post:{
            select:{
                id:true,
                title:true,
                comments:true
            }
        }
    }
  });

  return result;
};

export const commentService={
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateCommentByCommentId,
    deleteCommentByCommentId,
    adminModerate
}