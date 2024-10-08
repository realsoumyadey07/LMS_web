import express from "express";
import {
  authorizeRoles,
  isAuthenticated,
} from "../middlewares/auth.middleware";
import { editCourse, getAllCourses, getCourseByUser, getSingleCourse, uploadCourse } from "../controllers/course.controller";
const courseRouter = express.Router();

//course routes
courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put("/edit-course/:id", isAuthenticated, authorizeRoles("admin"), editCourse);

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.get("/get-course-content/:id",isAuthenticated, getCourseByUser);

export default courseRouter;
