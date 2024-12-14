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
import { calculateAverage } from "../../../../../Utils/Calculators/CalculateAvg";
import { DataPickerBasedOnArgs } from "../../../../../Utils/Pickers/DataPickerBasedOnArgs";
import { DataPickerInObjectBasedOnArgs } from "../../../../../Utils/Pickers/DataPickerInObjectBasedOnArgs";
import { DataPickerBasedOnArgsForArray } from "../../../../../Utils/Pickers/DataPickerBasedOnArgsForArray";
import { ReturnCurrentValueIfIncluded } from "../../../../../Utils/Returner/ReturnCurrentValueIfIncluded";
import { ValidTypes } from "../../../../../Constants/ValidTypes/ValidTypes";
import { checkIsValidByPattern } from "../../../../../Validators/checkIsValidByPattern";
import { addDataToExistingObject } from "../../../../../Utils/DataAdder/addDataToExistingObject";
import { GetTimeStampBasedOnReceivedDate } from "../../../../../Utils/Date/GetTimeStampBasedOnReceivedDate";
import { IsBetween } from "../../../../../Utils/Math/IsBetween";
import { CheckDifferenceBetweenTwoDate } from "../../../../../Utils/Date/CheckDiffranceBetweenTwoDate";
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

      const date = new Date();

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, "0");

      const formattedDate = `${year}/${month}/${day}`;
      const fullDate = Date.now();
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
        createDate: formattedDate,
        fullDate,
        tags: blogTags,
        blogId: `blg_${Date.now()}_${RandomCharGenByLength(32)}`,
        likes: [],
      });

      await newBlogData.validate();

      await newBlogData.save();

      res.status(DoneStatusCode.done.standardStatusCode).json({
        message: getWordBasedOnCurrLang(language, "operationSuccess"),
        blogData: newBlogData.toJSON(),
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

  static async getAllBlogsWithPagination(req: Request, res: Response) {
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

      const tags = await TagModel.find({});

      const { page = 1, size = 5 } = req.query;
      const pageInt = parseInt(page as string, 10) || 1;
      const sizeInt = parseInt(size as string, 10) || 1;

      const sortType = ReturnCurrentValueIfIncluded(
        req.query.sortType as string,
        ValidTypes.sortTypes,
        ""
      );

      const blogSortBy = ReturnCurrentValueIfIncluded(
        req.query.blogSortBy as string,
        ValidTypes.blogSortType,
        ""
      );

      const blogs = await BlogModel.find({ publisherEmail: userEmail })
        .skip((pageInt - 1) * sizeInt)
        .limit(sizeInt)
        .exec();

      const count = await BlogModel.countDocuments();

      res.status(DoneStatusCode.done.standardStatusCode).json({
        message: getWordBasedOnCurrLang(language, "successful"),
        data: {
          blogs: (() => {
            const desiredBlog = blogs.map((item) => {
              const { innerHTML, ...others } = item.toJSON();
              const data = {
                rating: calculateAverage(others.rating),
                likes: others.likes.length,
                tags: DataPickerBasedOnArgsForArray(
                  DataPickerBasedOnArgs(item.tags, tags),
                  ["title", "value"]
                ),
              };
              return { ...others, ...data };
            });

            if (blogSortBy === "rating") {
              if (sortType === "ascending") {
                return desiredBlog.sort((a, b) => a.rating - b.rating);
              }
              if (sortType === "descending") {
                return desiredBlog.sort((a, b) => b.rating - a.rating);
              }
              return desiredBlog.sort((a, b) => a.rating);
            }

            if (blogSortBy === "published") {
              if (sortType === "ascending") {
                return desiredBlog.sort((a, b) =>
                  a.isPublished === b.isPublished ? 0 : a.isPublished ? -1 : 1
                );
              }
              if (sortType === "descending") {
                return desiredBlog
                  .sort((a, b) =>
                    a.isPublished === b.isPublished ? 1 : b.isPublished ? -1 : 1
                  )
                  .reverse();
              }
              return desiredBlog.sort((a, b) =>
                a.isPublished === b.isPublished ? 0 : a.isPublished ? -1 : 1
              );
            }

            if (blogSortBy === "likes") {
              if (sortType === "ascending") {
                return desiredBlog.sort((a, b) => a.likes - b.likes);
              }
              if (sortType === "descending") {
                return desiredBlog.sort((a, b) => b.likes - a.likes);
              }
              return desiredBlog.sort((a, b) => a.likes);
            }

            return desiredBlog;
          })(),

          count,
          page: pageInt,
          size: sizeInt,
          maxPages: Math.ceil(count / sizeInt),
        },
      });
    } catch (err) {
      UnKnownErrorSenderToClient({ req, res }, err);
    }
  }

  static async uploadBlogImageAndReturnImageUrl(req: Request, res: Response) {
    try {
      const language = req.headers.language as T_ValidLanguages;

      const currMode = process.env.MODE as "DEV" | "PROD";

      if (req.file) {
        const fileUrl = `${req.file.destination}${req.file.filename}`;
        res.status(DoneStatusCode.done.standardStatusCode).json({
          message: getWordBasedOnCurrLang(language, "operationSuccess"),
          imageHref:
            currMode === "DEV"
              ? `http://localhost:${
                  process.env.LISTEN_PORT as string
                }/${fileUrl}`
              : `https://api.self-blog.ir/${fileUrl}`,
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
    } catch (err) {
      UnKnownErrorSenderToClient({ req, res }, err);
    }
  }

  static async getBlogsWithDateRange(req: Request, res: Response) {
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

      checkIsValidByPattern(
        req.query["start-date"] as string,
        formats.date,
        getWordBasedOnCurrLang(language, "wrongType"),
        "start-date",
        (errData, errorMessage, errorKey) => {
          errors[errorKey] = addDataToExistingObject(errors[errorKey], {
            errorMessage,
          });
        }
      );

      checkIsValidByPattern(
        req.query["end-date"] as string,
        formats.date,
        getWordBasedOnCurrLang(language, "wrongType"),
        "end-date",
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

      const startDateTimeStamp = GetTimeStampBasedOnReceivedDate(
        req.query["start-date"] as string
      );

      const endDateTimeStamp = GetTimeStampBasedOnReceivedDate(
        req.query["end-date"] as string
      );

      if (
        CheckDifferenceBetweenTwoDate(startDateTimeStamp, endDateTimeStamp, 3)
      ) {
        ErrorSenderToClient(
          {
            data: {},
            errorData: {
              errorKey: "TWO_MANY_DAYS_IS_DIFFERENCE",
              errorMessage: getWordBasedOnCurrLang(language, "bigRange"),
            },
            expectedType: "string",
          },
          ErrorsStatusCode.notAcceptable.standardStatusCode,
          res
        );

        return;
      }
      const allBlogsCount = await BlogModel.countDocuments();

      const tags = await TagModel.find({});

      const { page = 1, size = 1 } = req.query;
      const pageInt = parseInt(page as string, 10) || 1;
      const sizeInt =
        size === "all" ? allBlogsCount : parseInt(size as string, 10) || 1;

      const allUserBlogs = await BlogModel.find({
        publisherEmail: desiredUser.email,
      })
        .skip((pageInt - 1) * sizeInt)
        .limit(sizeInt)
        .exec();

      const _desiredBlogs = allUserBlogs
        .map((i) => i.toJSON())
        .filter((item) => {
          const blogTimeStamp = GetTimeStampBasedOnReceivedDate(
            item.createDate
          );
          if (IsBetween(blogTimeStamp, startDateTimeStamp, endDateTimeStamp))
            return true;
          return false;
        });

      const desiredBlogs = _desiredBlogs.map((item) => ({
        ...item,
        likes: item.likes.length,
        rating: calculateAverage(item.rating),
        tags: DataPickerBasedOnArgsForArray(
          DataPickerBasedOnArgs(item.tags, tags),
          ["title", "value"]
        ),
      }));

      res.status(DoneStatusCode.done.standardStatusCode).json({
        message: getWordBasedOnCurrLang(language, "operationSuccess"),
        blogs: desiredBlogs,
        page: pageInt,
        size: sizeInt,
        allCount: allBlogsCount,
      });
    } catch (err) {
      UnKnownErrorSenderToClient({ req, res }, err);
    }
  }
}
