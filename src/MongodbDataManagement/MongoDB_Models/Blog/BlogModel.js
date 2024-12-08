"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = void 0;
// Mongoose
const mongoose_1 = __importDefault(require("mongoose"));
// Mongoose
// Schema
const BlogSchema_1 = require("../../MongoDB_Schemas/Blog/BlogSchema");
// Schema
exports.BlogModel = mongoose_1.default.model("blogs", BlogSchema_1.BlogSchema);
