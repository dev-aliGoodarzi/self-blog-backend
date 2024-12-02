// Express
import { Request, Response } from "express";
// Express

// Formats
import { formats } from "../../../../../Formats/formats";
// Formats

// Utils
import { addDataToExistingObject } from "../../../../../Utils/DataAdder/addDataToExistingObject";
// Utils

// Constants
import { getWordBasedOnCurrLang } from "../../../../../Constants/Languages";
import { T_ValidLanguages } from "../../../../../Constants/Languages/languageTypes";
// Constants

// Validators
import { checkIsNull } from "../../../../../Validators/checkIsNull";
import { checkIsValidByPattern } from "../../../../../Validators/checkIsValidByPattern";
// Validators

// Schemas
import { T_UserSchema } from "../../../../../MongodbDataManagement/MongoDB_Schemas/User/UserSchema";
// Schemas

// Services
import { _auth_services } from "./_auth_services";
import { AdminUserModel } from "../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel";
import { ErrorSenderToClient } from "../../../../../Constants/Errors/ErrorSenderToClient";
import { ErrorsStatusCode } from "../../../../../Constants/Errors/ErrorsStatusCode";
import { notFoundCurrentUser } from "../Middlewares/notFoundCurrentUser";
import { generateNewToken } from "../../../../../Utils/Generators/generateNewToken";
import { DoneStatusCode } from "../../../../../Constants/Done/DoneStatusCode";
// Services

export class _auth_classes {
  static registerUserDataValidate(req: Request) {
    const language = req.headers.language as T_ValidLanguages;
    const errors: { [key: string]: any } = {};
    const { email, password } = req.body;
    checkIsNull(
      email,
      "string",
      {
        errorKey: "email",
        errorMessage: getWordBasedOnCurrLang(language, "wrongType"),
      },
      (_errData, errKey) => {
        errors[errKey] = _errData;
      }
    );
    checkIsNull(
      password,
      "string",
      {
        errorKey: "password",
        errorMessage: getWordBasedOnCurrLang(language, "wrongType"),
      },
      (_errData, errKey) => {
        errors[errKey] = _errData;
      }
    );

    checkIsValidByPattern(
      email,
      formats.email,
      getWordBasedOnCurrLang(language, "emailFormatError"),
      "email",
      (errData, errMessage, errorKey) => {
        errors[errorKey] = addDataToExistingObject(errors[errorKey], {
          errMessage,
        });
      }
    );

    checkIsValidByPattern(
      password,
      formats.password,
      getWordBasedOnCurrLang(language, "passwordFormatError"),
      "password",
      (errData, errMessage, errorKey) => {
        errors[errorKey] = addDataToExistingObject(errors[errorKey], {
          errMessage,
        });
      }
    );

    if (Object.keys(errors).length > 0) {
      return {
        hasError: true,
        errorData: errors,
      };
    } else {
      return {
        hasError: false,
        errorData: {},
      };
    }
  }

  static async canRegisterCurrentEmailAndPassword(req: Request): Promise<
    | false
    | {
        email: string;
        password: string;
      }
  > {
    const isDuplicateUser = await _auth_services.isUserExist(req.body.email);
    if (isDuplicateUser) return false;
    return {
      email: req.body.email,
      password: req.body.password,
    };
  }

  static async canLoginCurrentEmailAndPassword(req: Request): Promise<
    | false
    | {
        email: string;
        password: string;
      }
  > {
    const isValidUser = await _auth_services.isUserExist(req.body.email);
    if (!isValidUser) return false;
    return {
      email: req.body.email,
      password: req.body.password,
    };
  }

  static async canResubmitUserAuthData(
    req: Request
  ): Promise<
    | "userNotExist"
    | "alreadyCompleted"
    | { [key: string]: any }
    | "doneForContinue"
  > {
    const language = req.headers.language as T_ValidLanguages;

    const { userEmail } = req;
    const currentUser = await AdminUserModel.findOne({
      email: userEmail,
    })!;

    console.log("userNotExistx");
    if (!currentUser) return "userNotExist";

    if (currentUser.isRegisterCompleted) {
      return "alreadyCompleted";
    }

    const errors: { [key: string]: any } = {};

    const desiredKeys = ["name", "lastName"];

    desiredKeys.forEach((item) => {
      checkIsNull(
        item,
        "string",
        {
          errorKey: "email",
          errorMessage: getWordBasedOnCurrLang(language, "wrongType"),
        },
        (_errData, errKey) => {
          errors[errKey] = _errData;
        }
      );
    });

    if (Object.keys(errors).length > 0) return errors;
    return "doneForContinue";
  }

  static async buildNewToken(req: Request, res: Response) {
    const refreshToken = req.headers["auth-refresh"];
    const language = req.headers.language as T_ValidLanguages;

    const errors: { [key: string]: any } = {};

    checkIsNull(
      refreshToken,
      "string",
      {
        errorKey: "email",
        errorMessage: getWordBasedOnCurrLang(language, "wrongType"),
      },
      (_errData, errKey) => {
        errors[errKey] = _errData;
      }
    );

    if (Object.keys(errors).length > 0) {
      ErrorSenderToClient(
        {
          data: {},
          errorData: {
            errorKey: "",
            errorMessage: getWordBasedOnCurrLang(
              language as T_ValidLanguages,
              "wrongType"
            ),
          },
          expectedType: "string",
        },
        ErrorsStatusCode.notAcceptable.standardStatusCode,
        res
      );
      return;
    }

    const desiredUser = await AdminUserModel.findOne({ refreshToken });

    if (!desiredUser) {
      notFoundCurrentUser({ req, res });
      return;
    }
    const newAccessToken = generateNewToken(
      {
        email: desiredUser.email as string,
        id: desiredUser.userId as string,
      },
      "1h"
    );

    const newRefreshToken = generateNewToken(
      {
        email: desiredUser.email as string,
        id: desiredUser.userId as string,
      },
      "2d"
    );

    desiredUser.userToken = newAccessToken;
    desiredUser.refreshToken = newRefreshToken;

    await desiredUser.save();

    res.status(DoneStatusCode.done.standardStatusCode).send({
      message: getWordBasedOnCurrLang(language, "operationSuccess"),
      data: { userToken: newAccessToken, refreshToken: newRefreshToken },
    });
  }
}
