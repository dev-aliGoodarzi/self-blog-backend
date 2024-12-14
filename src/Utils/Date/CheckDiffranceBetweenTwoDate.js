"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckDifferenceBetweenTwoDate = void 0;
const CheckDifferenceBetweenTwoDate = (startTimeStamp, endTimeStamp, differenceIOnMonth) => {
    const startDate = new Date(startTimeStamp);
    const endDate = new Date(endTimeStamp);
    // Calculate the difference in months
    const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        endDate.getMonth() -
        startDate.getMonth();
    // Check if the difference is more than x months
    if (monthDiff >= differenceIOnMonth) {
        return true;
    }
    else {
        return false;
    }
};
exports.CheckDifferenceBetweenTwoDate = CheckDifferenceBetweenTwoDate;
