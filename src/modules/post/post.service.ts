import { prisma } from "../../lib/prisma"
import { ICreatePostPayload } from "./post.interface"

const createPost=async(payload:ICreatePostPayload,userId:string)=>{
 const result=await prisma.post.create({
    data:{
        ...payload,
        authorId:userId
    }
 })
 return result
}

const getAllPosts=async()=>{
    const posts=await prisma.post.findMany(
        {
            include:{
                author:true,
                comments:true
            }
        }
    );

    return posts;

}

export const postService={
    createPost,
    getAllPosts
}