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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
const CalculateAvg_1 = require("../../../../../Utils/Calculators/CalculateAvg");
const DataPickerBasedOnArgs_1 = require("../../../../../Utils/Pickers/DataPickerBasedOnArgs");
const DataPickerBasedOnArgsForArray_1 = require("../../../../../Utils/Pickers/DataPickerBasedOnArgsForArray");
const ReturnCurrentValueIfIncluded_1 = require("../../../../../Utils/Returner/ReturnCurrentValueIfIncluded");
const ValidTypes_1 = require("../../../../../Constants/ValidTypes/ValidTypes");
const checkIsValidByPattern_1 = require("../../../../../Validators/checkIsValidByPattern");
const addDataToExistingObject_1 = require("../../../../../Utils/DataAdder/addDataToExistingObject");
const GetTimeStampBasedOnReceivedDate_1 = require("../../../../../Utils/Date/GetTimeStampBasedOnReceivedDate");
const IsBetween_1 = require("../../../../../Utils/Math/IsBetween");
const CheckDiffranceBetweenTwoDate_1 = require("../../../../../Utils/Date/CheckDiffranceBetweenTwoDate");
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
                const date = new Date();
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
                const day = String(date.getDate()).padStart(2, "0");
                const formattedDate = `${year}/${month}/${day}`;
                const fullDate = Date.now();
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
                    createDate: formattedDate,
                    fullDate,
                    tags: blogTags,
                    blogId: `blg_${Date.now()}_${(0, RandomCharGenByLength_1.RandomCharGenByLength)(32)}`,
                    likes: [],
                });
                yield newBlogData.validate();
                yield newBlogData.save();
                res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                    message: (0, Languages_1.getWordBasedOnCurrLang)(language, "operationSuccess"),
                    blogData: newBlogData.toJSON(),
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
    static getTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const language = req.headers.language;
                const allTags = yield TagModel_1.TagModel.find({});
                if (allTags.length < 5) {
                    const newTag = new TagModel_1.TagModel({
                        title: `RandomTitle : ${(0, RandomCharGenByLength_1.RandomCharGenByLength)(5)}`,
                        value: (0, RandomCharGenByLength_1.RandomCharGenByLength)(10),
                    });
                    yield newTag.save();
                }
                res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                    message: (0, Languages_1.getWordBasedOnCurrLang)(language, "operationSuccess"),
                    tags: allTags,
                });
            }
            catch (err) {
                (0, UnKnownErrorSenderToClient_1.UnKnownErrorSenderToClient)({ req, res }, err);
            }
        });
    }
    static getAllBlogsWithPagination(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const tags = yield TagModel_1.TagModel.find({});
                const { page = 1, size = 5 } = req.query;
                const pageInt = parseInt(page, 10) || 1;
                const sizeInt = parseInt(size, 10) || 1;
                const sortType = (0, ReturnCurrentValueIfIncluded_1.ReturnCurrentValueIfIncluded)(req.query.sortType, ValidTypes_1.ValidTypes.sortTypes, "");
                const blogSortBy = (0, ReturnCurrentValueIfIncluded_1.ReturnCurrentValueIfIncluded)(req.query.blogSortBy, ValidTypes_1.ValidTypes.blogSortType, "");
                const blogs = yield BlogModel_1.BlogModel.find({ publisherEmail: userEmail })
                    .skip((pageInt - 1) * sizeInt)
                    .limit(sizeInt)
                    .exec();
                const count = yield BlogModel_1.BlogModel.countDocuments();
                res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                    message: (0, Languages_1.getWordBasedOnCurrLang)(language, "successful"),
                    data: {
                        blogs: (() => {
                            const desiredBlog = blogs.map((item) => {
                                const _a = item.toJSON(), { innerHTML } = _a, others = __rest(_a, ["innerHTML"]);
                                const data = {
                                    rating: (0, CalculateAvg_1.calculateAverage)(others.rating),
                                    likes: others.likes.length,
                                    tags: (0, DataPickerBasedOnArgsForArray_1.DataPickerBasedOnArgsForArray)((0, DataPickerBasedOnArgs_1.DataPickerBasedOnArgs)(item.tags, tags), ["title", "value"]),
                                };
                                return Object.assign(Object.assign({}, others), data);
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
                                    return desiredBlog.sort((a, b) => a.isPublished === b.isPublished ? 0 : a.isPublished ? -1 : 1);
                                }
                                if (sortType === "descending") {
                                    return desiredBlog
                                        .sort((a, b) => a.isPublished === b.isPublished ? 1 : b.isPublished ? -1 : 1)
                                        .reverse();
                                }
                                return desiredBlog.sort((a, b) => a.isPublished === b.isPublished ? 0 : a.isPublished ? -1 : 1);
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
            }
            catch (err) {
                (0, UnKnownErrorSenderToClient_1.UnKnownErrorSenderToClient)({ req, res }, err);
            }
        });
    }
    static uploadBlogImageAndReturnImageUrl(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const language = req.headers.language;
                const currMode = process.env.MODE;
                if (req.file) {
                    const fileUrl = `${req.file.destination}${req.file.filename}`;
                    res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                        message: (0, Languages_1.getWordBasedOnCurrLang)(language, "operationSuccess"),
                        imageHref: currMode === "DEV"
                            ? `http://localhost:${process.env.LISTEN_PORT}/${fileUrl}`
                            : `https://api.self-blog.ir/${fileUrl}`,
                    });
                    return;
                }
                (0, ErrorSenderToClient_1.ErrorSenderToClient)({
                    data: {},
                    errorData: {
                        errorKey: "THIS_API_ONLY_ACCEPT_IMAGE",
                        errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "wrongType"),
                    },
                    expectedType: "file",
                }, ErrorsStatusCode_1.ErrorsStatusCode.notAcceptable.standardStatusCode, res);
            }
            catch (err) {
                (0, UnKnownErrorSenderToClient_1.UnKnownErrorSenderToClient)({ req, res }, err);
            }
        });
    }
    static getBlogsWithDateRange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                (0, checkIsValidByPattern_1.checkIsValidByPattern)(req.query["start-date"], formats_1.formats.date, (0, Languages_1.getWordBasedOnCurrLang)(language, "wrongType"), "start-date", (errData, errorMessage, errorKey) => {
                    errors[errorKey] = (0, addDataToExistingObject_1.addDataToExistingObject)(errors[errorKey], {
                        errorMessage,
                    });
                });
                (0, checkIsValidByPattern_1.checkIsValidByPattern)(req.query["end-date"], formats_1.formats.date, (0, Languages_1.getWordBasedOnCurrLang)(language, "wrongType"), "end-date", (errData, errorMessage, errorKey) => {
                    errors[errorKey] = (0, addDataToExistingObject_1.addDataToExistingObject)(errors[errorKey], {
                        errorMessage,
                    });
                });
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
                const startDateTimeStamp = (0, GetTimeStampBasedOnReceivedDate_1.GetTimeStampBasedOnReceivedDate)(req.query["start-date"]);
                const endDateTimeStamp = (0, GetTimeStampBasedOnReceivedDate_1.GetTimeStampBasedOnReceivedDate)(req.query["end-date"]);
                if ((0, CheckDiffranceBetweenTwoDate_1.CheckDifferenceBetweenTwoDate)(startDateTimeStamp, endDateTimeStamp, 3)) {
                    (0, ErrorSenderToClient_1.ErrorSenderToClient)({
                        data: {},
                        errorData: {
                            errorKey: "TWO_MANY_DAYS_IS_DIFFERENCE",
                            errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "bigRange"),
                        },
                        expectedType: "string",
                    }, ErrorsStatusCode_1.ErrorsStatusCode.notAcceptable.standardStatusCode, res);
                    return;
                }
                const allBlogsCount = yield BlogModel_1.BlogModel.countDocuments();
                const tags = yield TagModel_1.TagModel.find({});
                const { page = 1, size = 1 } = req.query;
                const pageInt = parseInt(page, 10) || 1;
                const sizeInt = size === "all" ? allBlogsCount : parseInt(size, 10) || 1;
                const allUserBlogs = yield BlogModel_1.BlogModel.find({
                    publisherEmail: desiredUser.email,
                })
                    .skip((pageInt - 1) * sizeInt)
                    .limit(sizeInt)
                    .exec();
                const _desiredBlogs = allUserBlogs
                    .map((i) => i.toJSON())
                    .filter((item) => {
                    const blogTimeStamp = (0, GetTimeStampBasedOnReceivedDate_1.GetTimeStampBasedOnReceivedDate)(item.createDate);
                    if ((0, IsBetween_1.IsBetween)(blogTimeStamp, startDateTimeStamp, endDateTimeStamp))
                        return true;
                    return false;
                });
                const desiredBlogs = _desiredBlogs.map((item) => (Object.assign(Object.assign({}, item), { likes: item.likes.length, rating: (0, CalculateAvg_1.calculateAverage)(item.rating), tags: (0, DataPickerBasedOnArgsForArray_1.DataPickerBasedOnArgsForArray)((0, DataPickerBasedOnArgs_1.DataPickerBasedOnArgs)(item.tags, tags), ["title", "value"]) })));
                res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                    message: (0, Languages_1.getWordBasedOnCurrLang)(language, "operationSuccess"),
                    blogs: desiredBlogs,
                    page: pageInt,
                    size: sizeInt,
                    allCount: allBlogsCount,
                });
            }
            catch (err) {
                (0, UnKnownErrorSenderToClient_1.UnKnownErrorSenderToClient)({ req, res }, err);
            }
        });
    }
}
exports.BlogClasses = BlogClasses;
