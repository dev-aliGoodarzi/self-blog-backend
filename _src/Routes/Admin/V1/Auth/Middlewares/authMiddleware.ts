import { Request, Response } from "express";
import { ErrorSenderToClient } from "../../../../../Constants/Errors/ErrorSenderToClient";
import { getWordBasedOnCurrLang } from "../../../../../Constants/Languages";
import { T_ValidLanguages } from "../../../../../Constants/Languages/languageTypes";
import { ErrorsStatusCode } from "../../../../../Constants/Errors/ErrorsStatusCode";
import { AdminUserModel } from "../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel";
import jwt from "jsonwebtoken";

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

  if (String(userToken).length < 10) {
    ErrorSenderToClient(
      {
        data: {},
        expectedType: "string",
        errorData: {
          errorKey: "NOT_FOUND_TOKEN",
          errorMessage: getWordBasedOnCurrLang(
            language as T_ValidLanguages,
            "lengthIsLittleThanDesire"
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

  try {
    const isValidToken = jwt.verify(
      userToken as string,
      String(process.env.JWT_SECRET)
    );
    if (isValidToken) {
      if (selectedUser.isRegisterCompleted) {
        req.userId = selectedUser.id;
        req.userEmail = selectedUser.email;
        next();
        return;
      } else {
        ErrorSenderToClient(
          {
            data: {},
            errorData: {
              errorKey: "NOT_AUTH_COMPLETED",
              errorMessage: getWordBasedOnCurrLang(
                language,
                "notAuthCompleted"
              ),
            },
            expectedType: "string",
          },
          ErrorsStatusCode.notAcceptable.standardStatusCode,
          res
        );
      }
    } else {
      throw new Error("Not Valid Token ... in Middleware");
    }
  } catch (err) {
    console.log(err);
    ErrorSenderToClient(
      {
        data: {},
        expectedType: "string",
        errorData: {
          errorKey: "EXPIRED_TOKEN",
          errorMessage: getWordBasedOnCurrLang(
            language as T_ValidLanguages,
            "expiredToken"
          ),
        },
      },
      ErrorsStatusCode.notAuthorized.standardStatusCode,
      res
    );
  }
};
