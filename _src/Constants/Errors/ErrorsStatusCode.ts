export type T_ErrorsStatusCodeKeys =
  | "notAcceptable"
  | "duplicate"
  | "unExpectedError"
  | "notExist"
  | "notAuthorized";

export const ErrorsStatusCode: Record<
  T_ErrorsStatusCodeKeys,
  {
    internalStatusCode: number;
    standardStatusCode: number;
  }
> = {
  notAcceptable: {
    internalStatusCode: 900,
    standardStatusCode: 422,
  },
  duplicate: {
    internalStatusCode: 901,
    standardStatusCode: 423,
  },
  unExpectedError: {
    internalStatusCode: 902,
    standardStatusCode: 426,
  },
  notExist: {
    internalStatusCode: 903,
    standardStatusCode: 404,
  },
  notAuthorized: {
    internalStatusCode: 904,
    standardStatusCode: 401,
  },
};
