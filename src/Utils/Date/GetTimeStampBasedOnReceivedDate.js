"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTimeStampBasedOnReceivedDate = void 0;
const GetTimeStampBasedOnReceivedDate = (dateString) => {
    const date = new Date(dateString);
    return date.getTime();
};
exports.GetTimeStampBasedOnReceivedDate = GetTimeStampBasedOnReceivedDate;
