import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { userModel } from "../models/user.model";
import ApiError from "../utils/apiError";
import jwt, { Secret } from "jsonwebtoken";
require("dotenv").config();

interface IRegistrationBody {
     name: string;
     email: string;
     password: string;
     avatar?: string;
}

export const registrationUser = asyncHandler(async(req: Request, res: Response, next: NextFunction)=> {
     try {
          const {name, email, password, avatar} = req.body as IRegistrationBody;
          const isEmailExist = await userModel.findOne({email});
          if(isEmailExist){
               return next(new ApiError("Email already exist", 400));
          }
          const user: IRegistrationBody = {
               name, email, password
          };
          const activationToken = createActivationToken(user);
          
     } catch (error) {
          
     }
});

interface IActivationToken {
     token: string;
     activationCode: string;
}

export const createActivationToken = (user: IRegistrationBody): IActivationToken => {
     const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
     const token = jwt.sign(
          {
               user,
               activationCode,
          },
          process.env.ACTIVATION_SECRET as Secret,
          {
               expiresIn: "5m"
          }
     );
     return {activationCode, token}
}