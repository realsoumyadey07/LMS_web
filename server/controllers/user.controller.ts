import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { IUser, userModel } from "../models/user.model";
import ApiError from "../utils/apiError";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
require("dotenv").config();
import ejs from "ejs";
import path from "path";
import { sendMail } from "../utils/sendMail";
import ApiResponse from "../utils/apiResponse";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import { getUserById } from "../services/user.service";
import cloudinary from "cloudinary";

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, avatar } = req.body as IRegistrationBody;
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ApiError("Email already exist", 400));
      }
      const user: IRegistrationBody = {
        name,
        email,
        password,
      };
      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      const html: string = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ApiError(error.message, 400));
      }
    } catch (error: any) {
      return next(new ApiError(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (
  user: IRegistrationBody
): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );
  return { activationCode, token };
};

//activate user

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ApiError("Invalid activation code", 400));
      }
      const { name, email, password } = newUser.user;
      const userExist = await userModel.findOne({ email });
      if (userExist) {
        return next(new ApiError("Email already exist", 400));
      }
      const user = await userModel.create({
        name,
        email,
        password,
      });
      res.status(200).json(new ApiResponse(200, user));
    } catch (error: any) {
      return next(new ApiError(error.message, 400));
    }
  }
);

//login user

interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;
      if ([email, password].some((i) => i === "")) {
        return next(new ApiError("All fields are required", 400));
      }
      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return next(new ApiError("Invalid email", 400));
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return next(new ApiError("Invalid password", 400));
      }

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ApiError(error.message, 400));
    }
  }
);

//logout user

export const logOut = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const userId = req.user?._id || "";
      redis.del(userId as string);
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ApiError(error.message, 400));
    }
  }
);

export const updateAccessToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;
      const message = "Couldn't refresh token";
      if (!decoded) {
        return next(new ApiError(message, 400));
      }
      const session = await redis.get(decoded.id as string);
      if (!session) {
        return next(new ApiError(message, 400));
      }
      const user = JSON.parse(session);
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );
      req.user = user;
      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error: any) {
      return next(new ApiError(error.message, 400));
    }
  }
);

//get userInfo

export const getUserInfo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return next(new ApiError("User Id not found", 404));
      }
      getUserById(userId as string, res);
    } catch (error: any) {
      return next(new ApiError(error.message, 400));
    }
  }
);

//social auth

interface ISocialAuthBody {
  email: string;
  password: string;
  avatar: string;
}

export const socialAuth = asyncHandler(
  async (res: Response, req: Request, next: NextFunction) => {
    try {
      const { email, password, avatar } = req.body as ISocialAuthBody;
      const user = await userModel.findOne({ email });
      if (!user) {
        const newUserv = await userModel.create({ email, password, avatar });
        sendToken(newUserv, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ApiError(error.message, 400));
    }
  }
);

//update user info

interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = asyncHandler(async (req: Request, res: Response, next: NextFunction)=> {
  try {
    const {name,email} = req.body as IUpdateUserInfo;
    const userId = req.user?._id;
    const user = await userModel.findById(userId);
    if(email && user){
      const isEmailExist = await userModel.findOne({email});
      if(isEmailExist){
        return next(new ApiError("Email already exist", 400));
      }
      user.email = email;
    }
    if(name && user){
      user.name = name as string;
    }
    await user?.save();
    await redis.set(userId as string, JSON.stringify(user));

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error: any) {
    return next(new ApiError(error.message, 400));
  }
});

//update user password

interface IUpdateUserPassword {
  oldPassword: string;
  newPassword: string;
}

export const updateUserPassword = asyncHandler(async (req: Request, res: Response, next:NextFunction)=> {
  try {
    const { oldPassword, newPassword} = req.body as IUpdateUserPassword;
    if(!oldPassword || !newPassword){
      return next(new ApiError("Old and new password is required!", 400));
    }
    const user = await userModel.findById(req.user?._id).select("+password");
    if(user?.password === undefined){
      return next(new ApiError("Invalid user", 400));
    }
    const isPasswordMatch = await user?.comparePassword(oldPassword);
    if(!isPasswordMatch){
      return next(new ApiError("Invalid old password!", 400));
    }
    user.password = newPassword;
    await user.save();
    await redis.set(req.user?._id as string, JSON.stringify(user));

    res.status(201).json({
      success: true,
      user,
    });

  } catch (error: any) {
    return next(new ApiError(error.message, 400));
  }
});

//update profile picture

interface IUpdateProfilePicture {
  avatar: string;
}

export const updateProfilePicture = asyncHandler(async (req: Request, res: Response, next: NextFunction)=> {
  try {
    const {avatar} = req.body as IUpdateProfilePicture;
    const userId = req.user?._id;
    const user = await userModel.findById(userId);
    if(avatar && user){
      if(user?.avatar?.public_id){
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
      }else {
        const myClud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
        });
        user.avatar = {
          public_id: myClud.public_id,
          url: myClud.secure_url,
        }
      }
    }
    await user?.save();
    await redis.set(userId as string, JSON.stringify(user));
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    return next(new ApiError(error.message, 400));
  }
})