import express from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { postController } from "./post.controller";

const router = express.Router();

router.post("/",auth(Role.USER,Role.ADMIN,Role.AUTHOR),postController.createPost);
router.get("/",postController.getAllPosts)

export const postRoutes = router;