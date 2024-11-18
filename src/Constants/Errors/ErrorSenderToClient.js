"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorSenderToClient = void 0;
// Types
const ErrorSenderToClient = (errData, statusCode, res) => {
    res.status(statusCode).send(errData);
};
exports.ErrorSenderToClient = ErrorSenderToClient;
