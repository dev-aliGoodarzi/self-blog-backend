"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogClasses = void 0;
const UnKnownErrorSenderToClient_1 = require("../../../../../Constants/Errors/UnKnownErrorSenderToClient");
// Constants
// Models
const UserModel_1 = require("../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel");
// Models
// Middlewares
const notFoundCurrentUser_1 = require("../../Auth/Middlewares/notFoundCurrentUser");
const BlogModel_1 = require("../../../../../MongodbDataManagement/MongoDB_Models/Blog/BlogModel");
const checkIsNull_1 = require("../../../../../Validators/checkIsNull");
const Languages_1 = require("../../../../../Constants/Languages");
const ErrorSenderToClient_1 = require("../../../../../Constants/Errors/ErrorSenderToClient");
const ErrorsStatusCode_1 = require("../../../../../Constants/Errors/ErrorsStatusCode");
const formats_1 = require("../../../../../Formats/formats");
const RandomCharGenByLength_1 = require("../../../../../Generators/CharGen/RandomCharGenByLength");
const TagModel_1 = require("../../../../../MongodbDataManagement/MongoDB_Models/Tags/TagModel");
const DoneStatusCode_1 = require("../../../../../Constants/Done/DoneStatusCode");
// Middlewares
class BlogClasses {
    static addNewBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const language = req.headers.language;
                const { userEmail } = req;
                const desiredUser = yield UserModel_1.AdminUserModel.findOne({
                    email: userEmail,
                });
                if (!desiredUser) {
                    (0, notFoundCurrentUser_1.notFoundCurrentUser)({ req, res });
                    return;
                }
                const errors = {};
                const desiredKeys = ["title", "innerHTML"];
                desiredKeys.forEach((item) => {
                    const body = req.body;
                    (0, checkIsNull_1.checkIsNull)(body[item], "string", {
                        errorKey: item,
                        errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "wrongType"),
                    }, (_errData, errKey) => {
                        errors[errKey] = _errData;
                    });
                });
                const allTags = yield TagModel_1.TagModel.find({});
                const isTagsValid = String((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.tags)
                    .split(",")
                    .every((tag) => allTags.map((_item) => _item === null || _item === void 0 ? void 0 : _item.value).includes(tag));
                if (!isTagsValid) {
                    errors["tags"] = {
                        errorKey: "tags",
                        errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "tagsMissMatch"),
                    };
                }
                if (Object.keys(errors).length > 0) {
                    (0, ErrorSenderToClient_1.ErrorSenderToClient)({
                        data: errors,
                        errorData: {
                            errorKey: "",
                            errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "wrongType"),
                        },
                        expectedType: "string",
                    }, ErrorsStatusCode_1.ErrorsStatusCode.notAcceptable.standardStatusCode, res);
                    console.log(errors);
                    return;
                }
                const blogTags = [];
                String((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.tags)
                    .split(",")
                    .forEach((item) => blogTags.push(item));
                const newBlogData = new BlogModel_1.BlogModel({
                    comments: [],
                    innerHTML: req.body.innerHTML.replaceAll(formats_1.formats.removeScriptRegEx, ""),
                    rating: [],
                    title: req.body.title,
                    isPublished: false,
                    publisherEmail: desiredUser.email,
                    tags: blogTags,
                    blogId: `blg_${Date.now()}_${(0, RandomCharGenByLength_1.RandomCharGenByLength)(32)}`,
                });
                yield newBlogData.validate();
                yield newBlogData.save();
                res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                    message: (0, Languages_1.getWordBasedOnCurrLang)(language, "operationSuccess"),
                });
            }
            catch (err) {
                (0, UnKnownErrorSenderToClient_1.UnKnownErrorSenderToClient)({ req, res }, err);
            }
        });
    }
    static removeSingleBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const language = req.headers.language;
                const { blogId } = req.params;
                const desiredBlog = yield BlogModel_1.BlogModel.findOneAndDelete({
                    blogId,
                });
                if (!desiredBlog) {
                    (0, ErrorSenderToClient_1.ErrorSenderToClient)({
                        data: {},
                        errorData: {
                            errorKey: "NOT_FOUND_BLOG || REMOVED_EARLIER",
                            errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "notFoundDesiredBlog"),
                        },
                        expectedType: "string",
                    }, ErrorsStatusCode_1.ErrorsStatusCode.notAcceptable.standardStatusCode, res);
                    return;
                }
                res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                    message: (0, Languages_1.getWordBasedOnCurrLang)(language, "operationSuccess"),
                });
            }
            catch (err) {
                (0, UnKnownErrorSenderToClient_1.UnKnownErrorSenderToClient)({ req, res }, err);
            }
        });
    }
    static editSingleBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const language = req.headers.language;
                const { blogId } = req.params;
                const desiredBlog = yield BlogModel_1.BlogModel.findOne({
                    blogId,
                });
                if (!desiredBlog) {
                    (0, ErrorSenderToClient_1.ErrorSenderToClient)({
                        data: {},
                        errorData: {
                            errorKey: "NOT_FOUND_BLOG || REMOVED_EARLIER",
                            errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "notFoundDesiredBlog"),
                        },
                        expectedType: "string",
                    }, ErrorsStatusCode_1.ErrorsStatusCode.notAcceptable.standardStatusCode, res);
                    return;
                }
                const { userEmail } = req;
                const desiredUser = yield UserModel_1.AdminUserModel.findOne({
                    email: userEmail,
                });
                if (!desiredUser) {
                    (0, notFoundCurrentUser_1.notFoundCurrentUser)({ req, res });
                    return;
                }
                const errors = {};
                const desiredKeys = ["title", "innerHTML"];
                desiredKeys.forEach((item) => {
                    const body = req.body;
                    (0, checkIsNull_1.checkIsNull)(body[item], "string", {
                        errorKey: item,
                        errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "wrongType"),
                    }, (_errData, errKey) => {
                        errors[errKey] = _errData;
                    });
                });
                const allTags = yield TagModel_1.TagModel.find({});
                const isTagsValid = String((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.tags).length === 0
                    ? true
                    : String((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.tags)
                        .split(",")
                        .every((tag) => allTags.map((_item) => _item === null || _item === void 0 ? void 0 : _item.value).includes(tag));
                if (!isTagsValid) {
                    errors["tags"] = {
                        errorKey: "tags",
                        errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "tagsMissMatch"),
                    };
                }
                if (Object.keys(errors).length > 0) {
                    (0, ErrorSenderToClient_1.ErrorSenderToClient)({
                        data: errors,
                        errorData: {
                            errorKey: "",
                            errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "wrongType"),
                        },
                        expectedType: "string",
                    }, ErrorsStatusCode_1.ErrorsStatusCode.notAcceptable.standardStatusCode, res);
                    console.log(errors);
                    return;
                }
                const blogTags = [];
                String((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.tags)
                    .split(",")
                    .forEach((item) => blogTags.push(item));
                desiredBlog.title = req.body.title;
                desiredBlog.innerHTML = req.body.innerHTML;
                if (String((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.tags).length !== 0) {
                    desiredBlog.tags = blogTags;
                }
                yield desiredBlog.save();
                res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                    message: (0, Languages_1.getWordBasedOnCurrLang)(language, "operationSuccess"),
                });
            }
            catch (err) {
                (0, UnKnownErrorSenderToClient_1.UnKnownErrorSenderToClient)({ req, res }, err);
            }
        });
    }
    static getSingleBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const language = req.headers.language;
                const { blogId } = req.params;
                const desiredBlog = yield BlogModel_1.BlogModel.findOne({
                    blogId,
                    publisherEmail: req.userEmail,
                });
                if (!desiredBlog) {
                    (0, ErrorSenderToClient_1.ErrorSenderToClient)({
                        data: {},
                        errorData: {
                            errorKey: "NOT_FOUND_BLOG || REMOVED_EARLIER",
                            errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "notFoundDesiredBlog"),
                        },
                        expectedType: "string",
                    }, ErrorsStatusCode_1.ErrorsStatusCode.notAcceptable.standardStatusCode, res);
                    return;
                }
                res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                    message: (0, Languages_1.getWordBasedOnCurrLang)(language, "operationSuccess"),
                    data: {
                        title: desiredBlog.title,
                        tags: desiredBlog.tags,
                        innerHTML: desiredBlog.innerHTML,
                    },
                });
            }
            catch (err) {
                (0, UnKnownErrorSenderToClient_1.UnKnownErrorSenderToClient)({ req, res }, err);
            }
        });
    }
}
exports.BlogClasses = BlogClasses;
