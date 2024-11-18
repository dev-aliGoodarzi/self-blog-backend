export const checkIsValidByPattern = <T extends string>(
  data: T,
  pattern: RegExp,
  errorMessage: string,
  errorKey: string,
  errFunction?: (data: T, errorMessage: string, errorKey: string) => void
):
  | { isValid: true }
  | {
      isValid: false;
      errorMessage: string;
    } => {
  const isValid = pattern.test(data);

  if (!isValid) {
    if (typeof errFunction === "function") {
      errFunction(data, errorMessage, errorKey);
    }
    return {
      errorMessage,
      isValid: false,
    };
  } else {
    return {
      isValid: true,
    };
  }
};
