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
exports._auth_classes = void 0;
// Express
// Formats
const formats_1 = require("../../../../../Formats/formats");
// Formats
// Utils
const addDataToExistingObject_1 = require("../../../../../Utils/DataAdder/addDataToExistingObject");
// Utils
// Constants
const Languages_1 = require("../../../../../Constants/Languages");
// Constants
// Validators
const checkIsNull_1 = require("../../../../../Validators/checkIsNull");
const checkIsValidByPattern_1 = require("../../../../../Validators/checkIsValidByPattern");
// Schemas
// Services
const _auth_services_1 = require("./_auth_services");
const UserModel_1 = require("../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel");
const ErrorSenderToClient_1 = require("../../../../../Constants/Errors/ErrorSenderToClient");
const ErrorsStatusCode_1 = require("../../../../../Constants/Errors/ErrorsStatusCode");
const notFoundCurrentUser_1 = require("../Middlewares/notFoundCurrentUser");
const generateNewToken_1 = require("../../../../../Utils/Generators/generateNewToken");
const DoneStatusCode_1 = require("../../../../../Constants/Done/DoneStatusCode");
// Services
class _auth_classes {
    static registerUserDataValidate(req) {
        const language = req.headers.language;
        const errors = {};
        const { email, password } = req.body;
        (0, checkIsNull_1.checkIsNull)(email, "string", {
            errorKey: "email",
            errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "wrongType"),
        }, (_errData, errKey) => {
            errors[errKey] = _errData;
        });
        (0, checkIsNull_1.checkIsNull)(password, "string", {
            errorKey: "password",
            errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "wrongType"),
        }, (_errData, errKey) => {
            errors[errKey] = _errData;
        });
        (0, checkIsValidByPattern_1.checkIsValidByPattern)(email, formats_1.formats.email, (0, Languages_1.getWordBasedOnCurrLang)(language, "emailFormatError"), "email", (errData, errMessage, errorKey) => {
            errors[errorKey] = (0, addDataToExistingObject_1.addDataToExistingObject)(errors[errorKey], {
                errMessage,
            });
        });
        (0, checkIsValidByPattern_1.checkIsValidByPattern)(password, formats_1.formats.password, (0, Languages_1.getWordBasedOnCurrLang)(language, "passwordFormatError"), "password", (errData, errMessage, errorKey) => {
            errors[errorKey] = (0, addDataToExistingObject_1.addDataToExistingObject)(errors[errorKey], {
                errMessage,
            });
        });
        if (Object.keys(errors).length > 0) {
            return {
                hasError: true,
                errorData: errors,
            };
        }
        else {
            return {
                hasError: false,
                errorData: {},
            };
        }
    }
    static canRegisterCurrentEmailAndPassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDuplicateUser = yield _auth_services_1._auth_services.isUserExist(req.body.email);
            if (isDuplicateUser)
                return false;
            return {
                email: req.body.email,
                password: req.body.password,
            };
        });
    }
    static canLoginCurrentEmailAndPassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValidUser = yield _auth_services_1._auth_services.isUserExist(req.body.email);
            if (!isValidUser)
                return false;
            return {
                email: req.body.email,
                password: req.body.password,
            };
        });
    }
    static canResubmitUserAuthData(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = req.headers.language;
            const { userEmail } = req;
            const currentUser = yield UserModel_1.AdminUserModel.findOne({
                email: userEmail,
            });
            console.log("userNotExistx");
            if (!currentUser)
                return "userNotExist";
            if (currentUser.isRegisterCompleted) {
                return "alreadyCompleted";
            }
            const errors = {};
            const desiredKeys = ["name", "lastName"];
            desiredKeys.forEach((item) => {
                (0, checkIsNull_1.checkIsNull)(item, "string", {
                    errorKey: "email",
                    errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "wrongType"),
                }, (_errData, errKey) => {
                    errors[errKey] = _errData;
                });
            });
            if (Object.keys(errors).length > 0)
                return errors;
            return "doneForContinue";
        });
    }
    static buildNewToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.headers["auth-refresh"];
            const language = req.headers.language;
            const errors = {};
            (0, checkIsNull_1.checkIsNull)(refreshToken, "string", {
                errorKey: "email",
                errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "wrongType"),
            }, (_errData, errKey) => {
                errors[errKey] = _errData;
            });
            if (Object.keys(errors).length > 0) {
                (0, ErrorSenderToClient_1.ErrorSenderToClient)({
                    data: {},
                    errorData: {
                        errorKey: "",
                        errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "wrongType"),
                    },
                    expectedType: "string",
                }, ErrorsStatusCode_1.ErrorsStatusCode.notAcceptable.standardStatusCode, res);
                return;
            }
            const desiredUser = yield UserModel_1.AdminUserModel.findOne({ refreshToken });
            if (!desiredUser) {
                (0, notFoundCurrentUser_1.notFoundCurrentUser)({ req, res });
                return;
            }
            const newAccessToken = (0, generateNewToken_1.generateNewToken)({
                email: desiredUser.email,
                id: desiredUser.userId,
            }, "1h");
            const newRefreshToken = (0, generateNewToken_1.generateNewToken)({
                email: desiredUser.email,
                id: desiredUser.userId,
            }, "2d");
            desiredUser.userToken = newAccessToken;
            desiredUser.refreshToken = newRefreshToken;
            yield desiredUser.save();
            res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).send({
                message: (0, Languages_1.getWordBasedOnCurrLang)(language, "operationSuccess"),
                data: { userToken: newAccessToken, refreshToken: newRefreshToken },
            });
        });
    }
}
exports._auth_classes = _auth_classes;
