import express from "express";
import { UserControllers } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
const router = express.Router();

// all users api

router.post("/register", UserControllers.registerUser);

router.get(
  "/me",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  UserControllers.getMyProfile,
);

router.put(
  "/my-profile",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  UserControllers.updateMyProfile,
);

export const UserRoutes = router;
