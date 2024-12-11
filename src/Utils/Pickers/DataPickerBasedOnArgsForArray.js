"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPickerBasedOnArgsForArray = void 0;
const DataPickerBasedOnArgsForArray = (data, selectedKeys) => {
    if ((typeof data !== "object" || data === null) && !Array.isArray(data)) {
        // Instead of throwing an error, return an empty array
        return [];
    }
    if (!Array.isArray(selectedKeys)) {
        // If selectedKeys is not an array, return an empty array
        return [];
    }
    if (Array.isArray(data)) {
        // Handle the case where data is an array of objects
        return data.map((item) => {
            const pickedData = {};
            selectedKeys.forEach((key) => {
                if (key in item) {
                    pickedData[key] = item[key];
                }
            });
            return pickedData;
        });
    }
    else {
        // Handle the case where data is a single object
        const pickedData = {};
        selectedKeys.forEach((key) => {
            if (key in data) {
                pickedData[key] = data[key];
            }
        });
        return pickedData;
    }
};
exports.DataPickerBasedOnArgsForArray = DataPickerBasedOnArgsForArray;
