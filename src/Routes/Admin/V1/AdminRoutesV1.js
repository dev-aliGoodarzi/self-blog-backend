"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutesV1 = void 0;
// Express
const express_1 = require("express");
// Express
// SubRoutes
const AdminAuth_1 = require("./Auth/AdminAuth");
const AdminProfileRoutes_1 = require("./Profile/AdminProfileRoutes");
const BlogRoutes_1 = require("./Blog/BlogRoutes");
// SubRoutes
exports.AdminRoutesV1 = (0, express_1.Router)();
// #region Auth
exports.AdminRoutesV1.use(AdminAuth_1.AdminAuth);
//
//
//
//
//
//
// #region Profile
exports.AdminRoutesV1.use(AdminProfileRoutes_1.AdminProfileRoutes);
//
//
//
//
//
//
// #region Blog
exports.AdminRoutesV1.use(BlogRoutes_1.BlogRoutes);
//
//
//
//
//
//
// #region Tags
