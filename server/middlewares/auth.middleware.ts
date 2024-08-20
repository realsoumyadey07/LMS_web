import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

export const isAuthenticated = asyncHandler(async (req: Request, res: Response, next: NextFunction)=> {
     const access_token = req.cookies.access_token;
     if(!access_token){
          return next(new ApiError("Please login to access this resourse", 400));
     }
     const decoded = jwt.verify(
          access_token,
          process.env.ACCESS_TOKEN as string
     ) as JwtPayload;
     if(!decoded){
          return next(new ApiError("Access token is not valid", 400));
     }
     const user = await redis.get(decoded.id);

     if(!user){
          return next(new ApiError("User not found", 400));
     }

     req.user = JSON.parse(user);

     next();
})