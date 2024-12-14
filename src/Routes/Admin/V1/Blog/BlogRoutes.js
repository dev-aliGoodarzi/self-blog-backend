"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
// Express
const express_1 = require("express");
// Express
// Classes
const BlogClasses_1 = require("./Classes/BlogClasses");
// Classes
// Middlewares
const authMiddleware_1 = require("../Auth/Middlewares/authMiddleware");
// Middlewares
// Multer
const multer_1 = __importDefault(require("multer"));
// Multer
const upload = (0, multer_1.default)({
    dest: "uploads/blog-images/",
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    },
});
exports.BlogRoutes = (0, express_1.Router)();
exports.BlogRoutes.post("/blog/add-new", authMiddleware_1.authMiddleware, BlogClasses_1.BlogClasses.addNewBlog);
exports.BlogRoutes.delete("/blog/remove-blog/:blogId", authMiddleware_1.authMiddleware, BlogClasses_1.BlogClasses.removeSingleBlog);
exports.BlogRoutes.patch("/blog/edit-blog/:blogId", authMiddleware_1.authMiddleware, BlogClasses_1.BlogClasses.editSingleBlog);
exports.BlogRoutes.get("/blog/get-blog/:blogId", authMiddleware_1.authMiddleware, BlogClasses_1.BlogClasses.getSingleBlog);
exports.BlogRoutes.get("/blog/tags", authMiddleware_1.authMiddleware, BlogClasses_1.BlogClasses.getTags);
exports.BlogRoutes.get("/blog/blogs", authMiddleware_1.authMiddleware, BlogClasses_1.BlogClasses.getAllBlogsWithPagination);
exports.BlogRoutes.post("/blog/upload-blog-image", authMiddleware_1.authMiddleware, upload.single("image"), BlogClasses_1.BlogClasses.uploadBlogImageAndReturnImageUrl);
exports.BlogRoutes.get("/blog/range-blog", authMiddleware_1.authMiddleware, BlogClasses_1.BlogClasses.getBlogsWithDateRange);
