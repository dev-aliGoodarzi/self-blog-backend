// Express
import { Request, Response } from "express";
// Express

// Schema
import { T_BasicUserData } from "../../../../../MongodbDataManagement/MongoDB_Schemas/User/UserSchema";
// Schema

// Validators
import {
  checkIsNull,
  T_ErrorData,
} from "../../../../../Validators/checkIsNull";
import { checkIsValidByPattern } from "../../../../../Validators/checkIsValidByPattern";
// Validators

// Models
import { AdminUserModel } from "../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel";
// Models

// Constants
import { getWordBasedOnCurrLang } from "../../../../../Constants/Languages";
import { T_ValidLanguages } from "../../../../../Constants/Languages/languageTypes";
import { ErrorSenderToClient } from "../../../../../Constants/Errors/ErrorSenderToClient";
import { ErrorsStatusCode } from "../../../../../Constants/Errors/ErrorsStatusCode";
import { UnKnownErrorSenderToClient } from "../../../../../Constants/Errors/UnKnownErrorSenderToClient";
import { DoneStatusCode } from "../../../../../Constants/Done/DoneStatusCode";
// Constants

// Formats
import { formats } from "../../../../../Formats/formats";
// Formats

// Utils
import { addDataToExistingObject } from "../../../../../Utils/DataAdder/addDataToExistingObject";
import { notFoundCurrentUser } from "../../Auth/Middlewares/notFoundCurrentUser";
import { BlogModel } from "../../../../../MongodbDataManagement/MongoDB_Models/Blog/BlogModel";
// Utils

export class UpdateAdminProfileClasses {
  static async updateBasicAdminProfileData(req: Request, res: Response) {
    try {
      const language = req.headers.language as T_ValidLanguages;

      const desiredKeys = ["name", "lastName"];
      const errors: { [key: string]: T_ErrorData } = {};

      desiredKeys.forEach((item) => {
        const body = req.body;

        checkIsNull(
          body[item],
          "string",
          {
            errorKey: item,
            errorMessage: getWordBasedOnCurrLang(language, "wrongType"),
          },
          (_errData, errKey) => {
            (errors as any)[errKey] = _errData;
          }
        );
      });

      if (Object.keys(errors).length > 0) {
        ErrorSenderToClient(
          {
            data: errors,
            errorData: {
              errorKey: "",
              errorMessage: getWordBasedOnCurrLang(language, "wrongType"),
            },
            expectedType: "string",
          },
          ErrorsStatusCode.notAcceptable.standardStatusCode,
          res
        );

        console.log(errors);

        return;
      }

      const { userEmail } = req;

      const desiredUser = await AdminUserModel.findOne({
        email: userEmail,
      });

      if (!desiredUser) {
        notFoundCurrentUser({ req, res });
        return;
      }

      desiredUser.name = req.body["name"];
      desiredUser.lastName = req.body["lastName"];
      //   desiredUser!.email = req.body["email"];

      await desiredUser.save();

      res.status(DoneStatusCode.done.standardStatusCode).json({
        message: getWordBasedOnCurrLang(language, "operationSuccess"),
      });
    } catch (err) {
      UnKnownErrorSenderToClient({ req, res }, err);
    }
  }

  static async updateBasicAdminProfileEmail(req: Request, res: Response) {
    try {
      const language = req.headers.language as T_ValidLanguages;

      const errors: { [key: string]: T_ErrorData } = {};

      checkIsValidByPattern(
        req.body["email"],
        formats.email,
        getWordBasedOnCurrLang(language, "emailFormatError"),
        "email",
        (errData, errorMessage, errorKey) => {
          errors[errorKey] = addDataToExistingObject(errors[errorKey], {
            errorMessage,
          });
        }
      );

      if (Object.keys(errors).length > 0) {
        ErrorSenderToClient(
          {
            data: errors,
            errorData: {
              errorKey: "",
              errorMessage: getWordBasedOnCurrLang(language, "wrongType"),
            },
            expectedType: "string",
          },
          ErrorsStatusCode.notAcceptable.standardStatusCode,
          res
        );

        console.log(errors);

        return;
      }

      const { userEmail } = req;

      const desiredUser = await AdminUserModel.findOne({
        email: userEmail,
      });

      if (!desiredUser) {
        notFoundCurrentUser({ req, res });
        return;
      }

      const isDuplicateEmail = await (async () => {
        if (userEmail === req.body["email"]) return false;

        const target = await AdminUserModel.findOne({
          email: req.body["email"],
        });

        if (!target) return false;

        return true;
      })();

      if (isDuplicateEmail) {
        ErrorSenderToClient(
          {
            data: {},
            errorData: {
              errorKey: "",
              errorMessage: getWordBasedOnCurrLang(language, "duplicateUser"),
            },
            expectedType: "string",
          },
          ErrorsStatusCode.duplicate.standardStatusCode,
          res
        );
        return;
      }

      desiredUser.email = req.body["email"];

      await BlogModel.findOneAndUpdate(
        { publisherEmail: userEmail },
        {
          publisherEmail: req.body["email"],
        }
      );

      await desiredUser.save();

      res.status(DoneStatusCode.done.standardStatusCode).json({
        message: getWordBasedOnCurrLang(language, "operationSuccess"),
      });
    } catch (err) {
      UnKnownErrorSenderToClient({ req, res }, err);
    }
  }

  static async updateAdminUserProfileImage(req: Request, res: Response) {
    const language = req.headers.language as T_ValidLanguages;
    const { userEmail } = req;
    const desiredUser = await AdminUserModel.findOne({ email: userEmail });

    if (!desiredUser) {
      notFoundCurrentUser({ req, res });
      return;
    }

    if (req.file) {
      desiredUser.image = req.file.filename;

      await desiredUser.save();

      res.status(DoneStatusCode.done.standardStatusCode).json({
        message: getWordBasedOnCurrLang(language, "operationSuccess"),
      });
      return;
    }

    ErrorSenderToClient(
      {
        data: {},
        errorData: {
          errorKey: "THIS_API_ONLY_ACCEPT_IMAGE",
          errorMessage: getWordBasedOnCurrLang(language, "wrongType"),
        },
        expectedType: "file",
      },
      ErrorsStatusCode.notAcceptable.standardStatusCode,
      res
    );
  }
}
