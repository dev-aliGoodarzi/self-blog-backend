"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidDate = void 0;
// Formats
const formats_1 = require("../../Formats/formats");
// Formats
const IsValidDate = (dateString) => {
    const pattern = formats_1.formats.date;
    if (!pattern.test(dateString)) {
        return false;
    }
    return true;
};
exports.IsValidDate = IsValidDate;
