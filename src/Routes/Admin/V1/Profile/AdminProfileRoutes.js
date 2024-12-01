"use strict";
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
exports.AdminProfileRoutes = (0, express_1.Router)();
exports.AdminProfileRoutes.get("/profile", authMiddleware_1.authMiddleware, GetAdminProfileClasses_1.GetProfileClasses.getCurrentAdminProfile);
exports.AdminProfileRoutes.put("/profile/edit/basic", authMiddleware_1.authMiddleware, UpdateAdminProfileClasses_1.UpdateAdminProfileClasses.updateBasicAdminProfileData);
exports.AdminProfileRoutes.patch("/profile/edit/basic/email", authMiddleware_1.authMiddleware, UpdateAdminProfileClasses_1.UpdateAdminProfileClasses.updateBasicAdminProfileEmail);
