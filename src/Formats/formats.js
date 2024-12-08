"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formats = void 0;
exports.formats = {
    email: /^\S+@\S+\.\S+$/,
    password: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    removeScriptRegEx: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
};
