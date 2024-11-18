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

    const currentUser = await AdminUserModel.findOne({
      email: req.body.email,
    })!;
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
}
