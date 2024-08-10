import express from "express";
import {
  activateUser,
  loginUser,
  logOut,
  registrationUser,
  updateAccessToken,
} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login-user", loginUser);
userRouter.get("/logout-user", logOut);
userRouter.get("/refresh", updateAccessToken);

export default userRouter;
