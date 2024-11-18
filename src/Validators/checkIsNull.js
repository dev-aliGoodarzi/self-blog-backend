"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsNull = void 0;
const checkIsNull = (data, expectedType, errorData, onErrorFunction) => {
    if (typeof data !== expectedType) {
        if (typeof onErrorFunction === "function") {
            onErrorFunction({
                data,
                expectedType,
                errorData,
            }, errorData.errorKey);
        }
        return {
            errorMessage: errorData.errorMessage,
        };
    }
    return {
        data,
    };
};
exports.checkIsNull = checkIsNull;
