import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";
require("dotenv").config();

interface ITokenOptions {
     expires: Date;
     maxAge: number;
     httpOnly: boolean;
     sameSite: "lax" | "strict" | "none" | undefined;
     secure?: boolean;
}

const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);

const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);

export const accessTokenOptions: ITokenOptions = {
     expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
     maxAge: accessTokenExpire * 60 * 60 * 1000,
     httpOnly: true,
     sameSite: "lax"
}

export const refreshTokenOptions: ITokenOptions = {
     expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
     maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
     httpOnly: true,
     sameSite: "lax"
}

export const sendToken = async (
     user: IUser, 
     statusCode: number, 
     res: Response) => {
     const accessToken = await user.SignAccessToken();
     const refreshToken = await user.SignRefreshToken();

     //upload session to redis
     redis.set(user._id as string, JSON.stringify(user));
     res.cookie("access_token", accessToken);
     res.cookie("refresh_token", refreshToken);

     res.status(statusCode).json({
          success: true,
          user,
          accessToken,
          refreshToken
     });
}