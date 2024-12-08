"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModel = void 0;
// Express
const mongoose_1 = __importDefault(require("mongoose"));
// Express
// Schema
const TagsSchema_1 = require("../../MongoDB_Schemas/Tags/TagsSchema");
exports.TagModel = mongoose_1.default.model("tags", TagsSchema_1.TagsSchema);
