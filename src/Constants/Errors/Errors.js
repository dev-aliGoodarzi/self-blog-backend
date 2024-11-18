"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorGenerator = void 0;
// Types
const ErrorGenerator = (errData, statusCode, res) => {
    res.status(statusCode).send(errData);
};
exports.ErrorGenerator = ErrorGenerator;
