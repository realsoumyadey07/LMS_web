import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";


//upload course
export const uploadCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction)=> {
     try {
          const data = req.body;
          const thumbnail = data.thumbnail;
          if(thumbnail){
               const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                    folder: "courses"
               });
               data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
               }
          }
          createCourse(data, res, next);
     } catch (error: any) {
          return next(new ApiError(error.message, 400));
     }
})