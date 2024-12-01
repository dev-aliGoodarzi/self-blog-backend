// Express
import { Request, Response } from "express";
// Express

// Middlewares
import { notFoundCurrentUser } from "../../Auth/Middlewares/notFoundCurrentUser";
// Middlewares

// Models
import { AdminUserModel } from "../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel";
import { DoneStatusCode } from "../../../../../Constants/Done/DoneStatusCode";
import { getWordBasedOnCurrLang } from "../../../../../Constants/Languages";
import { T_ValidLanguages } from "../../../../../Constants/Languages/languageTypes";
// Models

export class GetProfileClasses {
  static async getCurrentAdminProfile(req: Request, res: Response) {
    const language = req.headers.language as T_ValidLanguages;

    const { userEmail } = req;

    const desierdUser = await AdminUserModel.findOne({
      email: userEmail,
    });

    if (!desierdUser) {
      notFoundCurrentUser({ req, res });
      return;
    }

    const { password, userToken, refreshToken, _id, ...others } =
      desierdUser.toJSON();

    res.status(DoneStatusCode.done.standardStatusCode).json({
      message: getWordBasedOnCurrLang(language, "successful"),
      data: others,
    });
  }
}
