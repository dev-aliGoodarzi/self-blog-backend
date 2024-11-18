"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutesV1 = void 0;
// Express
const express_1 = require("express");
// Express
// SubRoutes
const AdminAuth_1 = require("./Auth/AdminAuth");
// SubRoutes
exports.AdminRoutesV1 = (0, express_1.Router)();
exports.AdminRoutesV1.use(AdminAuth_1.AdminAuth);
