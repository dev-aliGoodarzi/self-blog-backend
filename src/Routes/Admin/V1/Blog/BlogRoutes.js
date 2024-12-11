"use strict";
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
exports.BlogRoutes = (0, express_1.Router)();
exports.BlogRoutes.post("/blog/add-new", authMiddleware_1.authMiddleware, BlogClasses_1.BlogClasses.addNewBlog);
exports.BlogRoutes.delete("/blog/remove-blog/:blogId", authMiddleware_1.authMiddleware, BlogClasses_1.BlogClasses.removeSingleBlog);
exports.BlogRoutes.patch("/blog/edit-blog/:blogId", authMiddleware_1.authMiddleware, BlogClasses_1.BlogClasses.editSingleBlog);
exports.BlogRoutes.get("/blog/get-blog/:blogId", authMiddleware_1.authMiddleware, BlogClasses_1.BlogClasses.getSingleBlog);
exports.BlogRoutes.get("/blog/tags", authMiddleware_1.authMiddleware, BlogClasses_1.BlogClasses.getTags);
exports.BlogRoutes.get("/blog/blogs", authMiddleware_1.authMiddleware, BlogClasses_1.BlogClasses.getAllBlogsWithPagination);
