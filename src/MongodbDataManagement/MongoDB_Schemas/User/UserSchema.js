"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
// Mongoose
const mongoose_1 = __importDefault(require("mongoose"));
// Mongoose
// Schemas
const BlogSchema_1 = require("../Blog/BlogSchema");
exports.UserSchema = new mongoose_1.default.Schema({
    name: String,
    lastName: String,
    email: String,
    password: String,
    userToken: String,
    refreshToken: String,
    userId: String,
    isRegisterCompleted: Boolean,
    blogs: [BlogSchema_1.BlogSchema],
    image: String,
    role: String, // ADMIN | NORMAL_USER
});