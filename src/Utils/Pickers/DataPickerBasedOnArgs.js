"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPickerBasedOnArgs = void 0;
const DataPickerBasedOnArgs = (selectedItems, mainArray) => {
    return mainArray.filter((item) => selectedItems.includes(item.value));
};
exports.DataPickerBasedOnArgs = DataPickerBasedOnArgs;
