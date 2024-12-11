export const DataPickerBasedOnArgs = (
  selectedItems: string[],
  mainArray: { title: string; value: string }[]
) => {
  return mainArray.filter((item) => selectedItems.includes(item.value));
};
