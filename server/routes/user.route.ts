import express from "express";
import {
  activateUser,
  getUserInfo,
  loginUser,
  logOut,
  registrationUser,
  updateAccessToken,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login-user", loginUser);
userRouter.get("/logout-user", isAuthenticated, logOut);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", isAuthenticated, getUserInfo);

export default userRouter;
