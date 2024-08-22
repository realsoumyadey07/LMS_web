import express from "express";
import {
  authorizeRoles,
  isAuthenticated,
} from "../middlewares/auth.middleware";
import { uploadCourse } from "../controllers/course.controller";
const courseRouter = express.Router();

//course routes
courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

export default courseRouter;
