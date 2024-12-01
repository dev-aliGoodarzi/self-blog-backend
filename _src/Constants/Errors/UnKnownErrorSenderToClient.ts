// Express
import { Request, Response } from "express";
// Express

// ErrorSender
import { ErrorSenderToClient } from "./ErrorSenderToClient";
// ErrorSender

// Languages
import { getWordBasedOnCurrLang } from "../Languages";
import { T_ValidLanguages } from "../Languages/languageTypes";
// Languages

// StatusCodes
import { ErrorsStatusCode } from "./ErrorsStatusCode";
// StatusCodes

export const UnKnownErrorSenderToClient = (
  pipeData: {
    req: Request;
    res: Response;
  },
  err: unknown
) => {
  const language = pipeData.req.headers.language as T_ValidLanguages;

  ErrorSenderToClient(
    {
      data: err,
      errorData: {
        errorKey: "",
        errorMessage: getWordBasedOnCurrLang(language, "unKnownError"),
      },
      expectedType: "string",
    },
    ErrorsStatusCode.notAcceptable.standardStatusCode,
    pipeData.res
  );
  console.log(err);
};
