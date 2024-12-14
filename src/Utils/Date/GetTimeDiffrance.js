"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTimeDifference = void 0;
const GetTimeDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = Math.abs(end - start);
    return {
        seconds: Math.floor(diffInMs / 1000),
        minutes: Math.floor(diffInMs / (1000 * 60)),
        hours: Math.floor(diffInMs / (1000 * 60 * 60)),
    };
};
exports.GetTimeDifference = GetTimeDifference;
