"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.BlogSchema = new mongoose_1.default.Schema({
    title: String,
    innerHTML: String,
    rating: Number,
    comments: [
        {
            commentTitle: String,
            writerId: String,
            commentBody: String,
            isPublished: Boolean,
        },
    ],
});
