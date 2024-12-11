"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPickerInObjectBasedOnArgs = void 0;
const DataPickerInObjectBasedOnArgs = (object, selectedKeys) => {
    // Validate the inputs
    if (typeof object !== "object" || object === null || Array.isArray(object)) {
        console.log(Array.isArray(object));
        console.log("l7");
        return {};
    }
    if (!Array.isArray(selectedKeys)) {
        console.log("l12");
        return {};
    }
    const pickedData = {};
    selectedKeys.forEach((key) => {
        if (key in object) {
            pickedData[key] = object[key];
        }
    });
    console.log(pickedData);
    return pickedData;
};
exports.DataPickerInObjectBasedOnArgs = DataPickerInObjectBasedOnArgs;
