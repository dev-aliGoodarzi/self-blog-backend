"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
// Express
const express_1 = require("express");
// Express
// Routes
const AdminRoutesV1_1 = require("./V1/AdminRoutesV1");
// Routes
exports.AdminRoutes = (0, express_1.Router)();
exports.AdminRoutes.use("/v1", AdminRoutesV1_1.AdminRoutesV1);
