"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomCharGenByLength = void 0;
const RandomCharGenByLength = (length = 16) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
};
exports.RandomCharGenByLength = RandomCharGenByLength;
