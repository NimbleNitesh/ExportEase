import express from "express";
import { UserController } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.route("/register").post(UserController.register);
userRouter.route("/login").post(UserController.login);
userRouter.route("/logout").post(UserController.logout);
userRouter.route("/forgot-password").post(UserController.forgotPassword);
userRouter.route("/change-password").post(UserController.chagePassword);
// userRouter.route("/me").get(UserController.me);

export default userRouter;
