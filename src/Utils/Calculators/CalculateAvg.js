"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAverage = calculateAverage;
function calculateAverage(arr) {
    if (arr.length === 0)
        return 0;
    const sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum / arr.length;
}
