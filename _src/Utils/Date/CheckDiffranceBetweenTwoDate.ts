export const CheckDifferenceBetweenTwoDate = (
  startTimeStamp: number,
  endTimeStamp: number,
  differenceIOnMonth: number
): boolean => {
  const startDate = new Date(startTimeStamp);
  const endDate = new Date(endTimeStamp);

  // Calculate the difference in months
  const monthDiff =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    endDate.getMonth() -
    startDate.getMonth();

  // Check if the difference is more than x months
  if (monthDiff >= differenceIOnMonth) {
    return true;
  } else {
    return false;
  }
};
