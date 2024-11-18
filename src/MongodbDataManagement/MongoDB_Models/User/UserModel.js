"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserModel = void 0;
// Mongoose
const mongoose_1 = __importDefault(require("mongoose"));
// Mongoose
// Schemas
const UserSchema_1 = require("../../MongoDB_Schemas/User/UserSchema");
// Schemas
exports.AdminUserModel = mongoose_1.default.model("admin_users", UserSchema_1.UserSchema);
