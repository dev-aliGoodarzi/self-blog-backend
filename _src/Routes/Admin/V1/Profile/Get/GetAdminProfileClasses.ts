// Express
import { Request, Response } from "express";
// Express

// Middlewares
import { notFoundCurrentUser } from "../../Auth/Middlewares/notFoundCurrentUser";
// Middlewares

// Models
import { AdminUserModel } from "../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel";
import { BlogModel } from "../../../../../MongodbDataManagement/MongoDB_Models/Blog/BlogModel";
// Models

// Constants
import { DoneStatusCode } from "../../../../../Constants/Done/DoneStatusCode";
import { getWordBasedOnCurrLang } from "../../../../../Constants/Languages";
import { T_ValidLanguages } from "../../../../../Constants/Languages/languageTypes";
import { UnKnownErrorSenderToClient } from "../../../../../Constants/Errors/UnKnownErrorSenderToClient";
import { ErrorSenderToClient } from "../../../../../Constants/Errors/ErrorSenderToClient";
import { ErrorsStatusCode } from "../../../../../Constants/Errors/ErrorsStatusCode";
// Constants

// Modules
import path from "path";
import fs from "fs";
// Modules

export class GetProfileClasses {
  static async getCurrentAdminProfile(req: Request, res: Response) {
    try {
      const language = req.headers.language as T_ValidLanguages;

      const { userEmail } = req;

      const desiredUser = await AdminUserModel.findOne({
        email: userEmail,
      });

      if (!desiredUser) {
        notFoundCurrentUser({ req, res });
        return;
      }

      const blogs = await BlogModel.find({ publisherEmail: userEmail });

      const { password, userToken, refreshToken, _id, ...others } =
        desiredUser.toJSON();

      res.status(DoneStatusCode.done.standardStatusCode).json({
        message: getWordBasedOnCurrLang(language, "successful"),
        data: { ...others, blogs: blogs.map((item) => item.blogId) },
      });
    } catch (err) {
      UnKnownErrorSenderToClient({ req, res }, err);
    }
  }

  static async getAdminAvatar(req: Request, res: Response, next: any) {
    try {
      const language = req.headers.language as T_ValidLanguages;

      const { userEmail } = req;

      const desiredUser = await AdminUserModel.findOne({
        email: userEmail,
      });

      if (!desiredUser) {
        notFoundCurrentUser({ req, res });
        return;
      }

      const filePath = path.resolve(
        __dirname,
        `./../../../../../../uploads/${desiredUser.image}`
      );

      fs.readFile(filePath, { encoding: "base64" }, (err, data) => {
        if (err) {
          ErrorSenderToClient(
            {
              data: {},
              errorData: {
                errorKey: "NO_AVATAR_IN_THIS_USER_DATA || MAYBE_FILE_REMOVED",
                errorMessage: getWordBasedOnCurrLang(language, "wrongType"),
              },
              expectedType: "file",
            },
            ErrorsStatusCode.notExist.standardStatusCode,
            res
          );

          return next(err);
        }

        res.status(DoneStatusCode.done.standardStatusCode).json({
          message: getWordBasedOnCurrLang(language, "operationSuccess"),
          data: `data:image/jpg;base64,${data}`,
        });
      });
    } catch (err) {
      UnKnownErrorSenderToClient({ req, res }, err);
    }
  }
}
