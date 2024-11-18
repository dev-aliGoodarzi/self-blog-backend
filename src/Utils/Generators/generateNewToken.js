"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNewToken = void 0;
// JWT
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// JWT
const generateNewToken = (user, expireTime) => {
    // The payload is the user data you want to include in the token
    const payload = {
        id: user.id,
        email: user.email,
    };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expireTime,
    });
    return token;
};
exports.generateNewToken = generateNewToken;
