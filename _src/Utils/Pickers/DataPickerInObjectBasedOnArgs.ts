export const DataPickerInObjectBasedOnArgs = <T extends Record<string, any>>(
  object: T,
  selectedKeys: string[]
): T => {
  // Validate the inputs
  if (typeof object !== "object" || object === null || Array.isArray(object)) {
    console.log(Array.isArray(object));
    console.log("l7");
    return {} as T;
  }

  if (!Array.isArray(selectedKeys)) {
    console.log("l12");
    return {} as T;
  }

  const pickedData: Record<string, any> = {};

  selectedKeys.forEach((key) => {
    if (key in object) {
      pickedData[key] = object[key];
    }
  });

  console.log(pickedData);

  return pickedData as T;
};
