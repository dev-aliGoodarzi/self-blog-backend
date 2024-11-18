"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsValidByPattern = void 0;
const checkIsValidByPattern = (data, pattern, errorMessage, errorKey, errFunction) => {
    const isValid = pattern.test(data);
    if (!isValid) {
        if (typeof errFunction === "function") {
            errFunction(data, errorMessage, errorKey);
        }
        return {
            errorMessage,
            isValid: false,
        };
    }
    else {
        return {
            isValid: true,
        };
    }
};
exports.checkIsValidByPattern = checkIsValidByPattern;
