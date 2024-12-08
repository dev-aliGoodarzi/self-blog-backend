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
exports.UpdateAdminProfileClasses = void 0;
// Schema
// Validators
const checkIsNull_1 = require("../../../../../Validators/checkIsNull");
const checkIsValidByPattern_1 = require("../../../../../Validators/checkIsValidByPattern");
// Validators
// Models
const UserModel_1 = require("../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel");
// Models
// Constants
const Languages_1 = require("../../../../../Constants/Languages");
const ErrorSenderToClient_1 = require("../../../../../Constants/Errors/ErrorSenderToClient");
const ErrorsStatusCode_1 = require("../../../../../Constants/Errors/ErrorsStatusCode");
const UnKnownErrorSenderToClient_1 = require("../../../../../Constants/Errors/UnKnownErrorSenderToClient");
const DoneStatusCode_1 = require("../../../../../Constants/Done/DoneStatusCode");
// Constants
// Formats
const formats_1 = require("../../../../../Formats/formats");
// Formats
// Utils
const addDataToExistingObject_1 = require("../../../../../Utils/DataAdder/addDataToExistingObject");
const notFoundCurrentUser_1 = require("../../Auth/Middlewares/notFoundCurrentUser");
const BlogModel_1 = require("../../../../../MongodbDataManagement/MongoDB_Models/Blog/BlogModel");
// Utils
class UpdateAdminProfileClasses {
    static updateBasicAdminProfileData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const language = req.headers.language;
                const desiredKeys = ["name", "lastName"];
                const errors = {};
                desiredKeys.forEach((item) => {
                    const body = req.body;
                    (0, checkIsNull_1.checkIsNull)(body[item], "string", {
                        errorKey: item,
                        errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "wrongType"),
                    }, (_errData, errKey) => {
                        errors[errKey] = _errData;
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
                const { userEmail } = req;
                const desiredUser = yield UserModel_1.AdminUserModel.findOne({
                    email: userEmail,
                });
                if (!desiredUser) {
                    (0, notFoundCurrentUser_1.notFoundCurrentUser)({ req, res });
                    return;
                }
                desiredUser.name = req.body["name"];
                desiredUser.lastName = req.body["lastName"];
                //   desiredUser!.email = req.body["email"];
                yield desiredUser.save();
                res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                    message: (0, Languages_1.getWordBasedOnCurrLang)(language, "operationSuccess"),
                });
            }
            catch (err) {
                (0, UnKnownErrorSenderToClient_1.UnKnownErrorSenderToClient)({ req, res }, err);
            }
        });
    }
    static updateBasicAdminProfileEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const language = req.headers.language;
                const errors = {};
                (0, checkIsValidByPattern_1.checkIsValidByPattern)(req.body["email"], formats_1.formats.email, (0, Languages_1.getWordBasedOnCurrLang)(language, "emailFormatError"), "email", (errData, errorMessage, errorKey) => {
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
                const { userEmail } = req;
                const desiredUser = yield UserModel_1.AdminUserModel.findOne({
                    email: userEmail,
                });
                if (!desiredUser) {
                    (0, notFoundCurrentUser_1.notFoundCurrentUser)({ req, res });
                    return;
                }
                const isDuplicateEmail = yield (() => __awaiter(this, void 0, void 0, function* () {
                    if (userEmail === req.body["email"])
                        return false;
                    const target = yield UserModel_1.AdminUserModel.findOne({
                        email: req.body["email"],
                    });
                    if (!target)
                        return false;
                    return true;
                }))();
                if (isDuplicateEmail) {
                    (0, ErrorSenderToClient_1.ErrorSenderToClient)({
                        data: {},
                        errorData: {
                            errorKey: "",
                            errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "duplicateUser"),
                        },
                        expectedType: "string",
                    }, ErrorsStatusCode_1.ErrorsStatusCode.duplicate.standardStatusCode, res);
                    return;
                }
                desiredUser.email = req.body["email"];
                yield BlogModel_1.BlogModel.findOneAndUpdate({ publisherEmail: userEmail }, {
                    publisherEmail: req.body["email"],
                });
                yield desiredUser.save();
                res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                    message: (0, Languages_1.getWordBasedOnCurrLang)(language, "operationSuccess"),
                });
            }
            catch (err) {
                (0, UnKnownErrorSenderToClient_1.UnKnownErrorSenderToClient)({ req, res }, err);
            }
        });
    }
    static updateAdminUserProfileImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = req.headers.language;
            const { userEmail } = req;
            const desiredUser = yield UserModel_1.AdminUserModel.findOne({ email: userEmail });
            if (!desiredUser) {
                (0, notFoundCurrentUser_1.notFoundCurrentUser)({ req, res });
                return;
            }
            if (req.file) {
                desiredUser.image = req.file.filename;
                yield desiredUser.save();
                res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                    message: (0, Languages_1.getWordBasedOnCurrLang)(language, "operationSuccess"),
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
        });
    }
}
exports.UpdateAdminProfileClasses = UpdateAdminProfileClasses;
