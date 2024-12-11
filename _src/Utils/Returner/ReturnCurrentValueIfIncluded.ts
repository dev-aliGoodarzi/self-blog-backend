export const ReturnCurrentValueIfIncluded = (
  desiredValue: string,
  acceptableValues: string[],
  ifNotExistReturns: string
) => {
  if (acceptableValues.includes(desiredValue)) return desiredValue;
  return ifNotExistReturns;
};
