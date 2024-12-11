export function calculateAverage(arr: number[]) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  return sum / arr.length;
}
