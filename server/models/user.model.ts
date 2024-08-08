import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
require("dotenv").config();

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface IUser extends Document{
     name: string;
     email: string;
     password: string;
     avatar: {
          public_id: string,
          url: string
     };
     role: string;
     isVerified: boolean;
     courses: Array<{ courseId: string }>;
     comparePassword: (password: string)=> Promise<boolean>;
     SignAccessToken: ()=> string;
     SignRefreshToken: ()=> string;
}

const userSchema: Schema<IUser> = new Schema({
     name: {
          type: String,
          required: [true, "Name is required!"]
     },
     email: {
          type: String,
          required: [true, "Email is required!"],
          validate: {
               validator: function (value: string){
                    return emailRegexPattern.test(value);
               },
               message: "Please enter a valid email!"
          }
     },
     password: {
          type: String,
          required: [true, "Password is requied"]
     },
     avatar: {
          public_id: String,
          url: String
     },
     role: {
          type: String,
          default: "user"
     },
     isVerified: {
          type: Boolean,
          default: false
     },
     courses: [
          {
               courseId: String,
          }
     ]
}, {timestamps: true});


//password hashing
userSchema.pre<IUser>("save", async function (next){
     if (!this.isModified("password")){
          return next();
     }
     this.password = await bcrypt.hash(this.password, 10);
     next();
})

//compare password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
     return await bcrypt.compare(enteredPassword, this.password);
}

//sign accessToken
userSchema.methods.SignAccessToken =async function() {
     return await jwt.sign({ id: this._id}, process.env.ACCESS_TOKEN || "", {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRE
     })
}

//sign refreshToken
userSchema.methods.SignRefreshToken = async function () {
     return await jwt.sign({id: this._id}, process.env.ACCESS_TOKEN || "", {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRE
     })
}

export const userModel = mongoose.model("User", userSchema);