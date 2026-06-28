import { auth } from './../../middlewares/auth';
import  express  from 'express';
import { commentController } from './comment.controller';
import { Role } from '../../../generated/prisma/enums';

const router=express.Router();

// all api
router.post("/",auth(Role.USER,Role.ADMIN),commentController.createComment);
router.get("/author/:authorId",commentController.getCommentByAuthorId);
router.get("/:commentId",commentController.getCommentByCommentId);
router.patch("/:commentId",auth(Role.ADMIN,Role.USER),commentController.updateCommentByCommentId);
router.delete("/:commentId",auth(Role.ADMIN,Role.USER),commentController.deleteCommentByCommentId);
router.patch("/:commentId/moderate",auth(Role.ADMIN),commentController.adminModerate)


export const commentRoutes=router;