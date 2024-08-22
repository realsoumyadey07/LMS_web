import express from "express";
import {
  activateUser,
  getUserInfo,
  loginUser,
  logOut,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updateProfilePicture,
  updateUserInfo,
  updateUserPassword,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login-user", loginUser);
userRouter.get("/logout-user", isAuthenticated, logOut);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", isAuthenticated, getUserInfo);
userRouter.post("/socialAuth", socialAuth);
userRouter.put("/updateUserInfo", isAuthenticated, updateUserInfo);
userRouter.put("/updateUserPassword", isAuthenticated, updateUserPassword);
userRouter.put("/updateUserAvatar", isAuthenticated, updateProfilePicture);

export default userRouter;
