export const DataPickerBasedOnArgsForArray = <
  T extends Record<string, any> | Record<string, any>[]
>(
  data: T,
  selectedKeys: string[]
): T => {
  if ((typeof data !== "object" || data === null) && !Array.isArray(data)) {
    // Instead of throwing an error, return an empty array
    return [] as any;
  }

  if (!Array.isArray(selectedKeys)) {
    // If selectedKeys is not an array, return an empty array
    return [] as any;
  }

  if (Array.isArray(data)) {
    // Handle the case where data is an array of objects
    return data.map((item) => {
      const pickedData: Record<string, any> = {};
      selectedKeys.forEach((key) => {
        if (key in item) {
          pickedData[key] = item[key];
        }
      });
      return pickedData;
    }) as T;
  } else {
    // Handle the case where data is a single object
    const pickedData: Record<string, any> = {};
    selectedKeys.forEach((key) => {
      if (key in data) {
        pickedData[key] = data[key];
      }
    });
    return pickedData as T;
  }
};
