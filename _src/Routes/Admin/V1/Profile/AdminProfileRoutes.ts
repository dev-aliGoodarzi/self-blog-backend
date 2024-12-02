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

// Multer
import multer from "multer";
// Multer

export const AdminProfileRoutes = Router();

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

AdminProfileRoutes.get(
  "/profile",
  authMiddleware,
  GetProfileClasses.getCurrentAdminProfile
);

AdminProfileRoutes.get(
  "/profile/avatar",
  authMiddleware,
  GetProfileClasses.getAdminAvatar
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

AdminProfileRoutes.put(
  "/profile/edit/extra/image",
  authMiddleware,
  upload.single("avatar"),
  UpdateAdminProfileClasses.updateAdminUserProfileImage
);
