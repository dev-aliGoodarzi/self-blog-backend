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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfileClasses = void 0;
// Express
// Middlewares
const notFoundCurrentUser_1 = require("../../Auth/Middlewares/notFoundCurrentUser");
// Middlewares
// Models
const UserModel_1 = require("../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel");
const BlogModel_1 = require("../../../../../MongodbDataManagement/MongoDB_Models/Blog/BlogModel");
// Models
// Constants
const DoneStatusCode_1 = require("../../../../../Constants/Done/DoneStatusCode");
const Languages_1 = require("../../../../../Constants/Languages");
const UnKnownErrorSenderToClient_1 = require("../../../../../Constants/Errors/UnKnownErrorSenderToClient");
const ErrorSenderToClient_1 = require("../../../../../Constants/Errors/ErrorSenderToClient");
const ErrorsStatusCode_1 = require("../../../../../Constants/Errors/ErrorsStatusCode");
// Constants
// Modules
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Modules
class GetProfileClasses {
    static getCurrentAdminProfile(req, res) {
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
                const blogs = yield BlogModel_1.BlogModel.find({ publisherEmail: userEmail });
                const _a = desiredUser.toJSON(), { password, userToken, refreshToken, _id } = _a, others = __rest(_a, ["password", "userToken", "refreshToken", "_id"]);
                res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                    message: (0, Languages_1.getWordBasedOnCurrLang)(language, "successful"),
                    data: Object.assign(Object.assign({}, others), { blogs: blogs.map((item) => item.blogId) }),
                });
            }
            catch (err) {
                (0, UnKnownErrorSenderToClient_1.UnKnownErrorSenderToClient)({ req, res }, err);
            }
        });
    }
    static getAdminAvatar(req, res, next) {
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
                const filePath = path_1.default.resolve(__dirname, `./../../../../../../uploads/${desiredUser.image}`);
                fs_1.default.readFile(filePath, { encoding: "base64" }, (err, data) => {
                    if (err) {
                        (0, ErrorSenderToClient_1.ErrorSenderToClient)({
                            data: {},
                            errorData: {
                                errorKey: "NO_AVATAR_IN_THIS_USER_DATA || MAYBE_FILE_REMOVED",
                                errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "wrongType"),
                            },
                            expectedType: "file",
                        }, ErrorsStatusCode_1.ErrorsStatusCode.notExist.standardStatusCode, res);
                        return next(err);
                    }
                    res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                        message: (0, Languages_1.getWordBasedOnCurrLang)(language, "operationSuccess"),
                        data: `data:image/jpg;base64,${data}`,
                    });
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
                const { page = 1, size = 5 } = req.query;
                const pageInt = parseInt(page, 10);
                const sizeInt = parseInt(size, 10);
                const blogs = yield BlogModel_1.BlogModel.find({ publisherEmail: userEmail })
                    .skip((pageInt - 1) * sizeInt)
                    .limit(sizeInt)
                    .exec();
                const count = yield BlogModel_1.BlogModel.countDocuments();
                res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                    message: (0, Languages_1.getWordBasedOnCurrLang)(language, "successful"),
                    data: {
                        blogs,
                        count,
                        page,
                        size,
                    },
                });
            }
            catch (err) {
                (0, UnKnownErrorSenderToClient_1.UnKnownErrorSenderToClient)({ req, res }, err);
            }
        });
    }
}
exports.GetProfileClasses = GetProfileClasses;
