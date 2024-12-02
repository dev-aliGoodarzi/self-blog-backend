// Express
import { Request, Response } from "express";
// Express

// Models
import { AdminUserModel } from "../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel";
// Models

// Schema
import { T_UserSchema } from "../../../../../MongodbDataManagement/MongoDB_Schemas/User/UserSchema";
// Schema

// Utils
import bcrypt from "bcrypt";
// Utils

// Constants
import { DoneStatusCode } from "../../../../../Constants/Done/DoneStatusCode";
import { T_ValidLanguages } from "../../../../../Constants/Languages/languageTypes";
import { getWordBasedOnCurrLang } from "../../../../../Constants/Languages";
import { ErrorSenderToClient } from "../../../../../Constants/Errors/ErrorSenderToClient";
import { ErrorsStatusCode } from "../../../../../Constants/Errors/ErrorsStatusCode";
import { generateNewToken } from "../../../../../Utils/Generators/generateNewToken";
// Constants

export class _auth_services {
  static async isUserExist(useEmail: string): Promise<boolean> {
    const desiredUser = await AdminUserModel.findOne({
      email: useEmail,
    });

    if (desiredUser) return true;
    return false;
  }

  static async registerUser(
    email: string,
    password: string,
    pipeData: {
      req: Request;
      res: Response;
    }
  ) {
    const language = pipeData.req.headers.language as T_ValidLanguages;
    try {
      const hashPW = await bcrypt.hash(
        password,
        Number(process.env.SALT_ROUNDS)
      );

      const allAdminUsersCount = await AdminUserModel.find({});

      const newUserData: T_UserSchema = {
        email: email.toLowerCase(),
        isRegisterCompleted: false,
        lastName: "",
        name: "",
        password: hashPW,
        role: "ADMIN",
        userId: `ADMIN_${Date.now()}_${allAdminUsersCount.length}`,
        refreshToken: "",
        userToken: "",
        image: "",
        blogs: [],
      };

      const newUser = new AdminUserModel(newUserData);
      await newUser.save();

      pipeData.res.status(DoneStatusCode.done.standardStatusCode).send({
        message: getWordBasedOnCurrLang(language, "operationSuccess"),
      });
    } catch (err) {
      console.log(err);
      ErrorSenderToClient(
        {
          data: {
            unexpectedErr: err,
          },
          errorData: {
            errorKey: "",
            errorMessage: getWordBasedOnCurrLang(language, "unExpectedError"),
          },
          expectedType: "string",
        },
        ErrorsStatusCode.unExpectedError.standardStatusCode,
        pipeData.res
      );
    }
  }

  static async loginWithEmailAndPassword(pipeData: {
    req: Request;
    res: Response;
  }) {
    const { email, password } = pipeData.req.body;
    const language = pipeData.req.headers.language as T_ValidLanguages;

    const selectedAdmin = await AdminUserModel.findOne({
      email,
    });

    if (!selectedAdmin) {
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
        ErrorsStatusCode.notExist.standardStatusCode,
        pipeData.res
      );
      return null;
    }

    const isPasswordAsSameAs = await bcrypt.compare(
      password,
      selectedAdmin.password as string
    );

    if (!isPasswordAsSameAs) {
      ErrorSenderToClient(
        {
          data: {},
          errorData: {
            errorKey: "",
            errorMessage: getWordBasedOnCurrLang(
              language as T_ValidLanguages,
              "notEqualPassword"
            ),
          },
          expectedType: "string",
        },
        ErrorsStatusCode.notAcceptable.standardStatusCode,
        pipeData.res
      );
      return;
    }

    const accessToken = generateNewToken(
      {
        email: selectedAdmin.email as string,
        id: selectedAdmin.userId as string,
      },
      "1h"
    );

    const refreshToken = generateNewToken(
      {
        email: selectedAdmin.email as string,
        id: selectedAdmin.userId as string,
      },
      "2d"
    );

    selectedAdmin.userToken = accessToken;
    selectedAdmin.refreshToken = refreshToken;

    await selectedAdmin.save();

    pipeData.res.status(DoneStatusCode.done.standardStatusCode).send({
      message: getWordBasedOnCurrLang(language, "operationSuccess"),
      data: selectedAdmin.toObject(),
    });

    return selectedAdmin;
  }

  static async reSubmitUserAuth(pipeData: { req: Request; res: Response }) {
    const { name, lastName } = pipeData.req.body;

    // const currentUser = (await AdminUserModel.findOne({
    //   email,
    // }))!;

    // currentUser.name = name;
    // currentUser.lastName = lastName;
  }
}
