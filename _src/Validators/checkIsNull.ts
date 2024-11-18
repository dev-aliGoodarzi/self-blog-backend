export type T_ErrorDataType<T> = {
  data: T;
  expectedType: "string" | "number";
  errorData: {
    errorKey: string;
    errorMessage: string;
  };
};

export const checkIsNull = <T>(
  data: T,
  expectedType: "string" | "number",
  errorData: {
    errorKey: string;
    errorMessage: string;
  },
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
