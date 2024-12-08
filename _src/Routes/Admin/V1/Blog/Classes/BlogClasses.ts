// Express
import { Request, Response } from "express";
// Express

// Constants
import { T_ValidLanguages } from "../../../../../Constants/Languages/languageTypes";
import { UnKnownErrorSenderToClient } from "../../../../../Constants/Errors/UnKnownErrorSenderToClient";
// Constants

// Models
import { AdminUserModel } from "../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel";
// Models

// Middlewares
import { notFoundCurrentUser } from "../../Auth/Middlewares/notFoundCurrentUser";
import { BlogModel } from "../../../../../MongodbDataManagement/MongoDB_Models/Blog/BlogModel";
import {
  checkIsNull,
  T_ErrorData,
} from "../../../../../Validators/checkIsNull";
import { getWordBasedOnCurrLang } from "../../../../../Constants/Languages";
import { ErrorSenderToClient } from "../../../../../Constants/Errors/ErrorSenderToClient";
import { ErrorsStatusCode } from "../../../../../Constants/Errors/ErrorsStatusCode";
import { formats } from "../../../../../Formats/formats";
import { RandomCharGenByLength } from "../../../../../Generators/CharGen/RandomCharGenByLength";
import { TagModel } from "../../../../../MongodbDataManagement/MongoDB_Models/Tags/TagModel";
import { DoneStatusCode } from "../../../../../Constants/Done/DoneStatusCode";
// Middlewares

export class BlogClasses {
  static async addNewBlog(req: Request, res: Response) {
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

      const errors: { [key: string]: T_ErrorData } = {};

      const desiredKeys = ["title", "innerHTML"];

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

      const allTags = await TagModel.find({});

      const isTagsValid: boolean = String(req?.body?.tags)
        .split(",")
        .every((tag: string) =>
          allTags.map((_item) => _item?.value).includes(tag)
        );

      if (!isTagsValid) {
        errors["tags"] = {
          errorKey: "tags",
          errorMessage: getWordBasedOnCurrLang(language, "tagsMissMatch"),
        };
      }

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

      const blogTags: string[] = [];
      String(req?.body?.tags)
        .split(",")
        .forEach((item) => blogTags.push(item));

      const newBlogData = new BlogModel({
        comments: [],
        innerHTML: req.body.innerHTML.replaceAll(formats.removeScriptRegEx, ""),
        rating: [],
        title: req.body.title,
        isPublished: false,
        publisherEmail: desiredUser.email,
        tags: blogTags,
        blogId: `blg_${Date.now()}_${RandomCharGenByLength(32)}`,
      });

      await newBlogData.validate();

      await newBlogData.save();

      res.status(DoneStatusCode.done.standardStatusCode).json({
        message: getWordBasedOnCurrLang(language, "operationSuccess"),
      });
    } catch (err) {
      UnKnownErrorSenderToClient({ req, res }, err);
    }
  }

  static async removeSingleBlog(req: Request, res: Response) {
    try {
      const language = req.headers.language as T_ValidLanguages;

      const { blogId } = req.params;

      const desiredBlog = await BlogModel.findOneAndDelete({
        blogId,
      });

      if (!desiredBlog) {
        ErrorSenderToClient(
          {
            data: {},
            errorData: {
              errorKey: "NOT_FOUND_BLOG || REMOVED_EARLIER",
              errorMessage: getWordBasedOnCurrLang(
                language,
                "notFoundDesiredBlog"
              ),
            },
            expectedType: "string",
          },
          ErrorsStatusCode.notAcceptable.standardStatusCode,
          res
        );
        return;
      }

      res.status(DoneStatusCode.done.standardStatusCode).json({
        message: getWordBasedOnCurrLang(language, "operationSuccess"),
      });
    } catch (err) {
      UnKnownErrorSenderToClient({ req, res }, err);
    }
  }

  static async editSingleBlog(req: Request, res: Response) {
    try {
      const language = req.headers.language as T_ValidLanguages;

      const { blogId } = req.params;

      const desiredBlog = await BlogModel.findOne({
        blogId,
      });

      if (!desiredBlog) {
        ErrorSenderToClient(
          {
            data: {},
            errorData: {
              errorKey: "NOT_FOUND_BLOG || REMOVED_EARLIER",
              errorMessage: getWordBasedOnCurrLang(
                language,
                "notFoundDesiredBlog"
              ),
            },
            expectedType: "string",
          },
          ErrorsStatusCode.notAcceptable.standardStatusCode,
          res
        );
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

      const errors: { [key: string]: T_ErrorData } = {};

      const desiredKeys = ["title", "innerHTML"];

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

      const allTags = await TagModel.find({});

      const isTagsValid: boolean =
        String(req?.body?.tags).length === 0
          ? true
          : String(req?.body?.tags)
              .split(",")
              .every((tag: string) =>
                allTags.map((_item) => _item?.value).includes(tag)
              );

      if (!isTagsValid) {
        errors["tags"] = {
          errorKey: "tags",
          errorMessage: getWordBasedOnCurrLang(language, "tagsMissMatch"),
        };
      }

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

      const blogTags: string[] = [];
      String(req?.body?.tags)
        .split(",")
        .forEach((item) => blogTags.push(item));

      desiredBlog.title = req.body.title;
      desiredBlog.innerHTML = req.body.innerHTML;
      if (String(req?.body?.tags).length !== 0) {
        desiredBlog.tags = blogTags;
      }

      await desiredBlog.save();

      res.status(DoneStatusCode.done.standardStatusCode).json({
        message: getWordBasedOnCurrLang(language, "operationSuccess"),
      });
    } catch (err) {
      UnKnownErrorSenderToClient({ req, res }, err);
    }
  }

  static async getSingleBlog(req: Request, res: Response) {
    try {
      const language = req.headers.language as T_ValidLanguages;

      const { blogId } = req.params;

      const desiredBlog = await BlogModel.findOne({
        blogId,
        publisherEmail: req.userEmail,
      });

      if (!desiredBlog) {
        ErrorSenderToClient(
          {
            data: {},
            errorData: {
              errorKey: "NOT_FOUND_BLOG || REMOVED_EARLIER",
              errorMessage: getWordBasedOnCurrLang(
                language,
                "notFoundDesiredBlog"
              ),
            },
            expectedType: "string",
          },
          ErrorsStatusCode.notAcceptable.standardStatusCode,
          res
        );
        return;
      }

      res.status(DoneStatusCode.done.standardStatusCode).json({
        message: getWordBasedOnCurrLang(language, "operationSuccess"),
        data: {
          title: desiredBlog.title,
          tags: desiredBlog.tags,
          innerHTML: desiredBlog.innerHTML,
        },
      });
    } catch (err) {
      UnKnownErrorSenderToClient({ req, res }, err);
    }
  }

  static async getTags(req: Request, res: Response) {
    try {
      const language = req.headers.language as T_ValidLanguages;

      const allTags = await TagModel.find({});

      if (allTags.length < 5) {
        const newTag = new TagModel({
          title: `RandomTitle : ${RandomCharGenByLength(5)}`,
          value: RandomCharGenByLength(10),
        });

        await newTag.save();
      }

      res.status(DoneStatusCode.done.standardStatusCode).json({
        message: getWordBasedOnCurrLang(language, "operationSuccess"),
        tags: allTags,
      });
    } catch (err) {
      UnKnownErrorSenderToClient({ req, res }, err);
    }
  }
}
