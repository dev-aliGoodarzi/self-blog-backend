// Express
import { Router } from "express";
// Express

// SubRoutes
import { AdminAuth } from "./Auth/AdminAuth";
import { AdminProfileRoutes } from "./Profile/AdminProfileRoutes";
import { BlogRoutes } from "./Blog/BlogRoutes";
// SubRoutes

export const AdminRoutesV1 = Router();

// #region Auth
AdminRoutesV1.use(AdminAuth);
//
//
//
//
//
//
// #region Profile
AdminRoutesV1.use(AdminProfileRoutes);
//
//
//
//
//
//
// #region Blog
AdminRoutesV1.use(BlogRoutes);
//
//
//
//
//
//
// #region Tags
