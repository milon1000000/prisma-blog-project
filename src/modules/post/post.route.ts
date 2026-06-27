import express from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { postController } from "./post.controller";

const router = express.Router();

router.post("/",auth(Role.USER,Role.ADMIN,Role.AUTHOR),postController.createPost);
router.get("/my-posts",auth(Role.USER,Role.ADMIN,Role.AUTHOR),postController.getMyPosts);
router.get("/",postController.getAllPosts);
router.get("/stats",auth(Role.ADMIN),postController.getPostsStats)

router.get("/:postId",postController.getPostById);
router.put("/:postId",auth(Role.USER,Role.ADMIN,Role.AUTHOR),postController.updatePost);
router.delete("/:postId",auth(Role.USER,Role.AUTHOR,Role.ADMIN),postController.deletePost);

export const postRoutes = router;