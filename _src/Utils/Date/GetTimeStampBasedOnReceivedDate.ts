export const GetTimeStampBasedOnReceivedDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.getTime();
};
