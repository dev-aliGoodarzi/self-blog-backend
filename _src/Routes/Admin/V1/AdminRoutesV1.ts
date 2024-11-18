// Express
import { Router } from "express";
// Express

// SubRoutes
import { AdminAuth } from "./Auth/AdminAuth";
// SubRoutes

export const AdminRoutesV1 = Router();

AdminRoutesV1.use(AdminAuth);
