"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDateDifferenceBetweenTwoDate = void 0;
const GetDateDifferenceBetweenTwoDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateArray = [];
    while (start <= end) {
        dateArray.push(new Date(start).toISOString().split("T")[0]);
        start.setDate(start.getDate() + 1);
    }
    return dateArray;
};
exports.GetDateDifferenceBetweenTwoDate = GetDateDifferenceBetweenTwoDate;
