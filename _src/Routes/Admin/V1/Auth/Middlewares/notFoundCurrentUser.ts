// Express
import { Request, Response } from "express";
// Express

// Constants
import { ErrorSenderToClient } from "../../../../../Constants/Errors/ErrorSenderToClient";
import { ErrorsStatusCode } from "../../../../../Constants/Errors/ErrorsStatusCode";
import { getWordBasedOnCurrLang } from "../../../../../Constants/Languages";
import { T_ValidLanguages } from "../../../../../Constants/Languages/languageTypes";
// Constants

export const notFoundCurrentUser = (pipeData: {
  req: Request;
  res: Response;
}) => {
  const language = pipeData.req.headers.language as T_ValidLanguages;
  ErrorSenderToClient(
    {
      data: {},
      expectedType: "string",
      errorData: {
        errorKey: "NOT_FOUND_USER",
        errorMessage: getWordBasedOnCurrLang(language, "notExistedUser"),
      },
    },
    ErrorsStatusCode.notAuthorized.standardStatusCode,
    pipeData.res
  );
};
