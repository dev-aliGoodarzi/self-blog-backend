"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDataToExistingObject = void 0;
const addDataToExistingObject = (data, extraData) => {
    return Object.assign(Object.assign({}, data), { extraData });
};
exports.addDataToExistingObject = addDataToExistingObject;
