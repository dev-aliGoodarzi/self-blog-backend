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

import nodemailer from "nodemailer";

// Services
import { _auth_services } from "./_auth_services";
import { AdminUserModel } from "../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel";
import { ErrorSenderToClient } from "../../../../../Constants/Errors/ErrorSenderToClient";
import { ErrorsStatusCode } from "../../../../../Constants/Errors/ErrorsStatusCode";
import { notFoundCurrentUser } from "../Middlewares/notFoundCurrentUser";
import { generateNewToken } from "../../../../../Utils/Generators/generateNewToken";
import { DoneStatusCode } from "../../../../../Constants/Done/DoneStatusCode";
import bcrypt from "bcrypt";
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
      (errData, errorMessage, errorKey) => {
        errors[errorKey] = addDataToExistingObject(errors[errorKey], {
          errorMessage,
        });
      }
    );

    checkIsValidByPattern(
      password,
      formats.password,
      getWordBasedOnCurrLang(language, "passwordFormatError"),
      "password",
      (errData, errorMessage, errorKey) => {
        errors[errorKey] = addDataToExistingObject(errors[errorKey], {
          errorMessage,
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
        errorKey: "refreshToken",
        errorMessage: getWordBasedOnCurrLang(language, "wrongType"),
      },
      (_errData, errKey) => {
        errors[errKey] = _errData;
      }
    );

    if (String(refreshToken).length < 10) {
      errors["auth-refresh"] = {
        errorKey: "NOT_ACCEPTABLE_REFRESH-TOKEN",
        errorMessage: getWordBasedOnCurrLang(
          language as T_ValidLanguages,
          "lengthIsLittleThanDesire"
        ),
      };
    }

    if (Object.keys(errors).length > 0) {
      ErrorSenderToClient(
        {
          data: errors,
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
      String(process.env.TOKEN_EXPIRE_TIME as string)
    );

    const newRefreshToken = generateNewToken(
      {
        email: desiredUser.email as string,
        id: desiredUser.userId as string,
      },
      String(process.env.REFRESH_TOKEN_EXPIRE_TIME as string)
    );

    desiredUser.userToken = newAccessToken;
    desiredUser.refreshToken = newRefreshToken;

    await desiredUser.save();

    res.status(DoneStatusCode.done.standardStatusCode).send({
      message: getWordBasedOnCurrLang(language, "operationSuccess"),
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  }

  static async forgetPasswordStep1(req: Request, res: Response) {
    const language = req.headers.language as T_ValidLanguages;

    const errors: { [key: string]: any } = {};

    checkIsValidByPattern(
      req.body.email,
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

    try {
      const desiredUser = await AdminUserModel.findOne({
        email: req.body.email,
      });

      if (desiredUser) {
        const refreshPasswordToken = generateNewToken(
          {
            email: desiredUser.email as string,
            id: desiredUser.userId as string,
          },
          "1h"
        );

        desiredUser.userPasswordResetToken = refreshPasswordToken;

        await desiredUser.save();
        const transporter = nodemailer.createTransport({
          host: "plesk.parsrad.com",
          port: 465, // Use port 25 for SMTP
          secure: true, // No SSL/TLS as per your setup
          auth: {
            user: "cccssss@my-template.ir",
            pass: "0Gx9$q41w",
          },
        });

        transporter.sendMail(
          {
            from: '"BlogAdmin" Email_Master',
            to: desiredUser.email,
            subject: "Test Email",
            text: "Hello world?",
            html: "<b>Hello world?</b>",
          },
          (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log("Message sent: %s", JSON.stringify(info));
          }
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      res.status(DoneStatusCode.done.standardStatusCode).json({
        message: getWordBasedOnCurrLang(
          language as T_ValidLanguages,
          "resetPasswordEmailSend"
        ),
      });
    }
  }
  static async forgetPasswordStep2(req: Request, res: Response) {
    const language = req.headers.language as T_ValidLanguages;

    const errors: { [key: string]: any } = {};

    const desiredUser = await AdminUserModel.findOne({
      userPasswordResetToken: req.headers["password-forget-token"],
    });

    if (!desiredUser) {
      ErrorSenderToClient(
        {
          data: errors,
          errorData: {
            errorKey: "",
            errorMessage: `${getWordBasedOnCurrLang(
              language as T_ValidLanguages,
              "notExistedUser"
            )} || ${getWordBasedOnCurrLang(
              language as T_ValidLanguages,
              "expiredToken"
            )}`,
          },
          expectedType: "string",
        },
        ErrorsStatusCode.notAcceptable.standardStatusCode,
        res
      );
      return;
    }

    checkIsValidByPattern(
      req.body.newPassword,
      formats.password,
      getWordBasedOnCurrLang(language, "passwordFormatError"),
      "newPassword",
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

    const hashPW = await bcrypt.hash(
      req.body.newPassword,
      Number(process.env.SALT_ROUNDS)
    );

    desiredUser.password = hashPW;
    desiredUser.userToken = "";
    desiredUser.refreshToken = "";
    desiredUser.userPasswordResetToken = "";

    await desiredUser.save();

    res.status(DoneStatusCode.done.standardStatusCode).send({
      message: getWordBasedOnCurrLang(language, "operationSuccess"),
    });
  }
}
