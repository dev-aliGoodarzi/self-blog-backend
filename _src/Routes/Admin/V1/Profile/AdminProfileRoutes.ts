// Express
import { Router } from "express";
// Express

// Middlewares
import { authMiddleware } from "../Auth/Middlewares/authMiddleware";
// Middlewares

// Get Handlers
import { GetProfileClasses } from "./Get/GetAdminProfileClasses";
// Get Handlers

// Update Handlers
import { UpdateAdminProfileClasses } from "./Update/UpdateAdminProfileClasses";
// Update Handlers

export const AdminProfileRoutes = Router();

AdminProfileRoutes.get(
  "/profile",
  authMiddleware,
  GetProfileClasses.getCurrentAdminProfile
);

AdminProfileRoutes.put(
  "/profile/edit/basic",
  authMiddleware,
  UpdateAdminProfileClasses.updateBasicAdminProfileData
);

AdminProfileRoutes.patch(
  "/profile/edit/basic/email",
  authMiddleware,
  UpdateAdminProfileClasses.updateBasicAdminProfileEmail
);

