export type T_ErrorData = {
  errorKey: string;
  errorMessage: string;
};

export type T_ErrorDataType<T> = {
  data?: T;
  expectedType: "string" | "number";
  errorData: T_ErrorData;
};

export const checkIsNull = <T>(
  data: T,
  expectedType: "string" | "number",
  errorData: T_ErrorData,
  onErrorFunction?: (_data: T_ErrorDataType<T>, errorKey: string) => void
):
  | {
      data: T | false;
    }
  | {
      errorMessage: string;
    } => {
  if (typeof data !== expectedType) {
    if (typeof onErrorFunction === "function") {
      onErrorFunction(
        {
          data,
          expectedType,
          errorData,
        },
        errorData.errorKey
      );
    }
    return {
      errorMessage: errorData.errorMessage,
    };
  }

  return {
    data,
  };
};
