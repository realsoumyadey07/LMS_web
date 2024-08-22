import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import { ErrorMiddleware } from "./middlewares/error.middleware";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
require("dotenv").config();

app.use(express.json({
     limit: "50mb"
}));

app.use(cookieParser());

app.use(cors({
     origin: ["http://localhost:3000"],
     credentials: true
}));

//routes
app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);

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