import { Or } from "./../../../generated/prisma/internal/prismaNamespace";
import { title } from "node:process";
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};

const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    //filter
    // where:{
    //  title:"My First Post",
    //  content:"Rolando"
    // },

    //filter AND

    //   where:{
    //  AND:[
    //   {
    //     title:"My First Post"
    //   },{
    //     content:"Rolando"
    //   }
    //  ]
    //   },

    // searching || partial match
    // where:{
    //   title:{
    //     contains:"rolando",
    //     mode:"insensitive"
    //   },
    //   content:{
    //     contains:"rolando",
    //     mode:"insensitive"
    //   }
    // },

    // where: {
    //   OR: [
    //      {
    //      title:{
    //       contains:"rolando",
    //       mode:"insensitive"
    //      }
    //      },
    //      {
    //       content:{
    //         contains:"RolanDo",
    //         mode:"insensitive"
    //       }
    //      }
    //   ],
    // },

    // combinign search(OR operator) and filtering (AND operator)
  //   where:{
  //  AND:[
  //   {
  //     OR:[
  //       {
  //         title:{
  //           contains:"Ronlando",
  //           mode:"insensitive"
  //         }
  //       },
  //       {
  //         content:{
  //           contains:"Ronlando",
  //           mode:"insensitive"
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     title:"Rolando"
  //   },
  //   {
  //     content:"Rolando"
  //   }
  //  ]
   
  //   },
  take:1,
  skip:0,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return posts;
};

const getPostById = async (postId: string) => {
  // await prisma.post.update({
  // where: { id: postId },
  // data: {
  //   views: {
  //     increment: 1,
  //   },
  // },
  // });

  // // throw new Error("Fake Error");
  // const post=await prisma.post.findUniqueOrThrow({
  // where:{
  //   id:postId
  // },
  // include:{
  //   author:{
  //     omit:{
  //       password:true
  //     }
  //   },
  //   comments:{
  //     where:{
  //       status:CommentStatus.APPROVED
  //     },
  //       orderBy:{
  //         createdAt:"desc"
  //       }
  //     },
  //     _count:{
  //       select:{
  //         comments:true
  //       }
  //     }
  //   }
  // })
  // return post;

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  });
  return transactionResult;
};

const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId: authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return result;
};

const updatePost = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findFirstOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      comments: true,
    },
  });

  return result;
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const getPostsStats = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      totalPublishedPost,
      totalDraftPosts,
      totalArchivedPost,
      totalComments,
      totalApprovedComments,
      totalRejectComments,
      totalPostViews,
    ] = await Promise.all([
      tx.post.count(),

      tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),

      tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),

      tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),

      tx.comment.count(),

      tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),

      tx.comment.count({
        where: {
          status: CommentStatus.REJECT,
        },
      }),

      tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalPosts,
      totalPublishedPost,
      totalDraftPosts,
      totalArchivedPost,
      totalComments,
      totalApprovedComments,
      totalRejectComments,
      totalPostViews: totalPostViews._sum.views ?? 0,
    };
  });

  return transactionResult;
};
export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getPostsStats,
};
