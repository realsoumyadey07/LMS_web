import mongoose, { Document, Schema } from "mongoose";

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
     courses: Array<{ courseId: string }>
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

export const userModel = mongoose.model("User", userSchema);