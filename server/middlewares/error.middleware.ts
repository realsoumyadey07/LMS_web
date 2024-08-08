import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";

export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction)=> {
     err.statusCode = err.statusCode || 500;
     err.message = err.message || "Internal server error";

     //wrong mongodb id error
     if(err.name === "CastError"){
          const message = `Resource not found. Invalid: ${err.path}`;
          err = new ApiError(message, 400);
     }

     //duplicate key error
     if(err.code === 11000){
          const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
          err = new ApiError(message, 400);
     }

     //wrong jwt error
     if(err.code === "JsonWebTokenError") {
          const message = `Json Web Token is invalid, try again`;
          err = new ApiError(message, 400);
     }

     //jwt expire error
     if(err.code === "TokenExpiredError"){
          const message = `Json Web Token has expired, login again`;
          err = new ApiError(message, 401);
     }

     res.status(err.statusCode).json(
          new ApiError(err.message, err.statusCode)
     ) 
}