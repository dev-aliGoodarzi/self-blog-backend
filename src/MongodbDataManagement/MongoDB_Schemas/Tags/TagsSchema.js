"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsSchema = void 0;
// Express
const mongoose_1 = __importDefault(require("mongoose"));
// Models
exports.TagsSchema = new mongoose_1.default.Schema({
    title: String,
    value: String,
});
