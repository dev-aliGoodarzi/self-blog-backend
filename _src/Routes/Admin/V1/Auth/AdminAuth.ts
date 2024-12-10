// Express
import { Router } from "express";
// Express

// AuthValidator
import { _auth_classes } from "./_classes/_auth_classes";
// AuthValidator

// Constants
import { ErrorsStatusCode } from "../../../../Constants/Errors/ErrorsStatusCode";
import { ErrorSenderToClient } from "../../../../Constants/Errors/ErrorSenderToClient";
import { getWordBasedOnCurrLang } from "../../../../Constants/Languages";
import { T_ValidLanguages } from "../../../../Constants/Languages/languageTypes";
import { DoneStatusCode } from "../../../../Constants/Done/DoneStatusCode";
import { UnKnownErrorSenderToClient } from "../../../../Constants/Errors/UnKnownErrorSenderToClient";
// Constants

// Validators
import { checkIsNull, T_ErrorData } from "../../../../Validators/checkIsNull";
// Validators

// Models
import { AdminUserModel } from "../../../../MongodbDataManagement/MongoDB_Models/User/UserModel";
// Models

// Services
import { _auth_services } from "./_classes/_auth_services";
// Services

// Middlewares
import { authMiddlewareWithoutFullRegisterRequired } from "./Middlewares/authMiddlewareWithoutFullRegisterRequired";
// Middlewares

export const AdminAuth = Router();

AdminAuth.post("/auth/register", async (req, res) => {
  const language = req.headers.language as T_ValidLanguages;
  try {
    const receivedDataErrors = _auth_classes.registerUserDataValidate(req);
    if (receivedDataErrors.hasError === true) {
      ErrorSenderToClient(
        {
          data: receivedDataErrors.errorData,
          errorData: {
            errorKey: "UNACCEPTABLE_DATA",
            errorMessage: getWordBasedOnCurrLang(language, "wrongType"),
          },
          expectedType: "string",
        },
        ErrorsStatusCode.notAcceptable.standardStatusCode,
        res
      );
      return;
    }

    const canRegisterCurrentEmailAndPassword =
      await _auth_classes.canRegisterCurrentEmailAndPassword(req);
    if (canRegisterCurrentEmailAndPassword === false) {
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

    _auth_services.registerUser(req.body.email, req.body.password, {
      req,
      res,
    });
  } catch (err) {
    console.log(err);
  }
});

AdminAuth.post("/auth/login", async (req, res) => {
  const language = req.headers.language as T_ValidLanguages;

  const receivedDataErrors = _auth_classes.registerUserDataValidate(req);
  if (receivedDataErrors.hasError === true) {
    ErrorSenderToClient(
      {
        data: receivedDataErrors.errorData,
        errorData: {
          errorKey: "UNACCEPTABLE_DATA",
          errorMessage: getWordBasedOnCurrLang(language, "wrongType"),
        },
        expectedType: "string",
      },
      ErrorsStatusCode.notAcceptable.standardStatusCode,
      res
    );
    return;
  }
  const canLoginCurrentEmailAndPassword =
    await _auth_classes.canLoginCurrentEmailAndPassword(req);
  if (canLoginCurrentEmailAndPassword === false) {
    ErrorSenderToClient(
      {
        data: {},
        errorData: {
          errorKey: "",
          errorMessage: getWordBasedOnCurrLang(
            language as T_ValidLanguages,
            "userNotExist"
          ),
        },
        expectedType: "string",
      },
      ErrorsStatusCode.duplicate.standardStatusCode,
      res
    );
    return;
  }

  await _auth_services.loginWithEmailAndPassword({
    req,
    res,
  });
});

AdminAuth.post("/auth/refresh-token", _auth_classes.buildNewToken);

AdminAuth.post(
  "/auth/forget-password/step1",
  _auth_classes.forgetPasswordStep1
);
AdminAuth.post(
  "/auth/forget-password/step2",
  _auth_classes.forgetPasswordStep2
);

AdminAuth.post(
  "/auth/resubmit-user-auth",
  authMiddlewareWithoutFullRegisterRequired,
  async (req, res) => {
    const language = req.headers.language as T_ValidLanguages;

    const { body } = req;

    try {
      const desiredUser = await AdminUserModel.findOne({
        email: req.userEmail,
      });

      if (desiredUser!.isRegisterCompleted) {
        ErrorSenderToClient(
          {
            data: {},
            errorData: {
              errorKey: "",
              errorMessage: getWordBasedOnCurrLang(
                language as T_ValidLanguages,
                "alreadyDone"
              ),
            },
            expectedType: "string",
          },
          ErrorsStatusCode.notAcceptable.standardStatusCode,
          res
        );
        return;
      } else {
        const errors: { [key: string]: T_ErrorData } = {};

        const desiredKeys = ["name", "lastName"];

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
          return;
        }

        desiredUser!.name = body["name"];
        desiredUser!.lastName = body["lastName"];
        desiredUser!.isRegisterCompleted = true;

        await desiredUser!.save();

        res.status(DoneStatusCode.done.standardStatusCode).json({
          message: getWordBasedOnCurrLang(language, "userAuthCompleted"),
        });
      }
    } catch (err) {
      UnKnownErrorSenderToClient({ req, res }, err);
    }
  }
);
