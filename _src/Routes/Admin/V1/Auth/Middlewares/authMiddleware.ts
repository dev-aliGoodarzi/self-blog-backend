import { Request, Response } from "express";
import { ErrorSenderToClient } from "../../../../../Constants/Errors/ErrorSenderToClient";
import { getWordBasedOnCurrLang } from "../../../../../Constants/Languages";
import { T_ValidLanguages } from "../../../../../Constants/Languages/languageTypes";
import { ErrorsStatusCode } from "../../../../../Constants/Errors/ErrorsStatusCode";
import { AdminUserModel } from "../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  const language = req.headers.language as T_ValidLanguages;
  const userToken = req.headers["auth-token"];

  if (!userToken) {
    ErrorSenderToClient(
      {
        data: {},
        expectedType: "string",
        errorData: {
          errorKey: "NOT_FOUND_TOKEN",
          errorMessage: getWordBasedOnCurrLang(
            language as T_ValidLanguages,
            "noToken"
          ),
        },
      },
      ErrorsStatusCode.notAuthorized.standardStatusCode,
      res
    );
    return;
  }

  const selectedUser = await AdminUserModel.findOne({ userToken });
  if (!selectedUser) {
    ErrorSenderToClient(
      {
        data: {},
        expectedType: "string",
        errorData: {
          errorKey: "NOT_FOUND_USER",
          errorMessage: getWordBasedOnCurrLang(
            language as T_ValidLanguages,
            "notExistedUser"
          ),
        },
      },
      ErrorsStatusCode.notAuthorized.standardStatusCode,
      res
    );
    return;
  }

  req.userId = selectedUser.id;
  req.userEmail = selectedUser.email;
  next();
};
