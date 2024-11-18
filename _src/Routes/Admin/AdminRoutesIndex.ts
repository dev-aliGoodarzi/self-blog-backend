// Express
import { Router } from "express";
// Express

// Routes
import { AdminRoutesV1 } from "./V1/AdminRoutesV1";
// Routes

export const AdminRoutes = Router();

AdminRoutes.use("/v1", AdminRoutesV1);
