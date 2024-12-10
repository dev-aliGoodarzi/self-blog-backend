export const addDataToExistingObject = <T>(
  data: T,
  extraData: {
    [key: string]: any;
  }
): T => {
  return {
    ...data,
    extraData,
  };
};
