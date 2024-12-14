export const GetDateDifferenceBetweenTwoDate = (
  startDate: string,
  endDate: string
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateArray = [];

  while (start <= end) {
    dateArray.push(new Date(start).toISOString().split("T")[0]);
    start.setDate(start.getDate() + 1);
  }

  return dateArray;
};
