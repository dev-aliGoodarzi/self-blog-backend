"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProfileRoutes = void 0;
// Express
const express_1 = require("express");
// Express
// Middlewares
const authMiddleware_1 = require("../Auth/Middlewares/authMiddleware");
// Middlewares
// Get Handlers
const GetAdminProfileClasses_1 = require("./Get/GetAdminProfileClasses");
// Get Handlers
// Update Handlers
const UpdateAdminProfileClasses_1 = require("./Update/UpdateAdminProfileClasses");
// Update Handlers
// Multer
const multer_1 = __importDefault(require("multer"));
const authMiddlewareWithoutFullRegisterRequired_1 = require("../Auth/Middlewares/authMiddlewareWithoutFullRegisterRequired");
// Multer
exports.AdminProfileRoutes = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    dest: "uploads/user-avatars/",
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    },
});
exports.AdminProfileRoutes.get("/profile", authMiddlewareWithoutFullRegisterRequired_1.authMiddlewareWithoutFullRegisterRequired, GetAdminProfileClasses_1.GetProfileClasses.getCurrentAdminProfile);
exports.AdminProfileRoutes.get("/profile/avatar", authMiddleware_1.authMiddleware, GetAdminProfileClasses_1.GetProfileClasses.getAdminAvatar);
exports.AdminProfileRoutes.put("/profile/edit/basic", authMiddleware_1.authMiddleware, UpdateAdminProfileClasses_1.UpdateAdminProfileClasses.updateBasicAdminProfileData);
exports.AdminProfileRoutes.patch("/profile/edit/basic/email", authMiddleware_1.authMiddleware, UpdateAdminProfileClasses_1.UpdateAdminProfileClasses.updateBasicAdminProfileEmail);
exports.AdminProfileRoutes.put("/profile/edit/extra/image", authMiddleware_1.authMiddleware, upload.single("avatar"), UpdateAdminProfileClasses_1.UpdateAdminProfileClasses.updateAdminUserProfileImage);
