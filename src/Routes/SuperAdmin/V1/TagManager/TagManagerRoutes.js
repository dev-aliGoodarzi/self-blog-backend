"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagManagerRoutes = void 0;
// Express
const express_1 = __importDefault(require("express"));
const TagManagerClasses_1 = require("./TagManagerClasses/TagManagerClasses");
// Express
exports.TagManagerRoutes = express_1.default.Router();
exports.TagManagerRoutes.get(`/tags`, TagManagerClasses_1.TagManagerClasses.getAllTags);
