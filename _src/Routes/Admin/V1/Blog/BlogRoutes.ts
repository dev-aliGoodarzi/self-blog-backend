// Express
import { Router } from "express";
// Express

// Classes
import { BlogClasses } from "./Classes/BlogClasses";
// Classes

// Middlewares
import { authMiddleware } from "../Auth/Middlewares/authMiddleware";
// Middlewares

export const BlogRoutes = Router();

BlogRoutes.post("/blog/add-new", authMiddleware, BlogClasses.addNewBlog);

BlogRoutes.delete(
  "/blog/remove-blog/:blogId",
  authMiddleware,
  BlogClasses.removeSingleBlog
);

BlogRoutes.patch(
  "/blog/edit-blog/:blogId",
  authMiddleware,
  BlogClasses.editSingleBlog
);

BlogRoutes.get(
  "/blog/get-blog/:blogId",
  authMiddleware,
  BlogClasses.getSingleBlog
);
