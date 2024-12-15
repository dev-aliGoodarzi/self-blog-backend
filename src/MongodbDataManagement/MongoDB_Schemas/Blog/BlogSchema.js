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
    rating: [Number],
    isPublished: Boolean,
    isRejected: Boolean,
    publisherEmail: String,
    blogId: String,
    tags: [String],
    createDate: String,
    fullDate: String,
    views: Number,
    editTimes: Number,
    likes: [
        {
            userId: String,
        },
    ],
    comments: [
        {
            commentTitle: String,
            writerId: String,
            commentBody: String,
            isPublished: Boolean,
        },
    ],
});
