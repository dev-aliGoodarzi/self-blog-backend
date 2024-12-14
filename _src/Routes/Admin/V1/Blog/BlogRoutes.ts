// Express
import { Router } from "express";
// Express

// Classes
import { BlogClasses } from "./Classes/BlogClasses";
// Classes

// Middlewares
import { authMiddleware } from "../Auth/Middlewares/authMiddleware";
// Middlewares

// Multer
import multer from "multer";
// Multer

const upload = multer({
  dest: "uploads/blog-images/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

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

BlogRoutes.get("/blog/tags", authMiddleware, BlogClasses.getTags);

BlogRoutes.get(
  "/blog/blogs",
  authMiddleware,
  BlogClasses.getAllBlogsWithPagination
);

BlogRoutes.post(
  "/blog/upload-blog-image",
  authMiddleware,
  upload.single("image"),
  BlogClasses.uploadBlogImageAndReturnImageUrl
);

BlogRoutes.get(
  "/blog/range-blog",
  authMiddleware,
  BlogClasses.getBlogsWithDateRange
);
