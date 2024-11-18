"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnAsDesiredType = void 0;
const ReturnAsDesiredType = (data, desiredType) => {
    if (desiredType === "string") {
        return typeof data === "string" ? data : "";
    }
    if (desiredType === "boolean") {
        return typeof data === "boolean" ? data : "NOT_BOOLEAN";
    }
    return "";
};
exports.ReturnAsDesiredType = ReturnAsDesiredType;
