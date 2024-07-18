import express from "express";
const userRouter = express.Router();
import {
  register,
  login,
  logout,
  getUser,
  updateUser,
  updatePassword,
  getUserPortfolioData,
  forgotPassword,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/getMe").get(authMiddleware, getUser);
userRouter.route("/update/me").patch(authMiddleware, updateUser);
userRouter.route("/update/password").patch(authMiddleware, updatePassword);
userRouter.route("/logout").get(authMiddleware, logout);

userRouter.route("/getUserPortfolio").get(getUserPortfolioData);
userRouter.route("/forgotPassword").patch(forgotPassword);

export default userRouter;
