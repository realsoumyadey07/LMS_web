import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ErrorMiddleware } from "./middlewares/error.middleware";
import userRouter from "./routes/user.route";
require("dotenv").config();
export const app = express();

app.use(express.json({
     limit: "50mb"
}));

app.use(cookieParser());

app.use(cors({
     origin: process.env.ORIGIN
}));

//routes
app.use("/api/v1", userRouter);

//tesing the server
app.use("/test", (req: Request, res: Response)=> {
     res.send("Server is running");
});

app.use("*", (req: Request, res: Response, next: NextFunction)=> {
     const err = new Error(`Route ${req.originalUrl} is not found`) as any;
     err.statusCode = 404;
     next(err);
});

app.use(ErrorMiddleware)