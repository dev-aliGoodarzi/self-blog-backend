"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnCurrentValueIfIncluded = void 0;
const ReturnCurrentValueIfIncluded = (desiredValue, acceptableValues, ifNotExistReturns) => {
    if (acceptableValues.includes(desiredValue))
        return desiredValue;
    return ifNotExistReturns;
};
exports.ReturnCurrentValueIfIncluded = ReturnCurrentValueIfIncluded;
