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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const ErrorSenderToClient_1 = require("../../../../../Constants/Errors/ErrorSenderToClient");
const Languages_1 = require("../../../../../Constants/Languages");
const ErrorsStatusCode_1 = require("../../../../../Constants/Errors/ErrorsStatusCode");
const UserModel_1 = require("../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const language = req.headers.language;
    const userToken = req.headers["auth-token"];
    if (!userToken) {
        (0, ErrorSenderToClient_1.ErrorSenderToClient)({
            data: {},
            expectedType: "string",
            errorData: {
                errorKey: "NOT_FOUND_TOKEN",
                errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "noToken"),
            },
        }, ErrorsStatusCode_1.ErrorsStatusCode.notAuthorized.standardStatusCode, res);
        return;
    }
    if (String(userToken).length < 10) {
        (0, ErrorSenderToClient_1.ErrorSenderToClient)({
            data: {},
            expectedType: "string",
            errorData: {
                errorKey: "NOT_FOUND_TOKEN",
                errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "lengthIsLittleThanDesire"),
            },
        }, ErrorsStatusCode_1.ErrorsStatusCode.notAuthorized.standardStatusCode, res);
        return;
    }
    const selectedUser = yield UserModel_1.AdminUserModel.findOne({ userToken });
    if (!selectedUser) {
        (0, ErrorSenderToClient_1.ErrorSenderToClient)({
            data: {},
            expectedType: "string",
            errorData: {
                errorKey: "NOT_FOUND_USER",
                errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "notExistedUser"),
            },
        }, ErrorsStatusCode_1.ErrorsStatusCode.notAuthorized.standardStatusCode, res);
        return;
    }
    try {
        const isValidToken = jsonwebtoken_1.default.verify(userToken, String(process.env.JWT_SECRET));
        if (isValidToken) {
            if (selectedUser.isRegisterCompleted) {
                req.userId = selectedUser.id;
                req.userEmail = selectedUser.email;
                next();
                return;
            }
            else {
                (0, ErrorSenderToClient_1.ErrorSenderToClient)({
                    data: {},
                    errorData: {
                        errorKey: "NOT_AUTH_COMPLETED",
                        errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "notAuthCompleted"),
                    },
                    expectedType: "string",
                }, ErrorsStatusCode_1.ErrorsStatusCode.notAcceptable.standardStatusCode, res);
            }
        }
        else {
            throw new Error("Not Valid Token ... in Middleware");
        }
    }
    catch (err) {
        console.log(err);
        (0, ErrorSenderToClient_1.ErrorSenderToClient)({
            data: {},
            expectedType: "string",
            errorData: {
                errorKey: "EXPIRED_TOKEN",
                errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "expiredToken"),
            },
        }, ErrorsStatusCode_1.ErrorsStatusCode.notAuthorized.standardStatusCode, res);
    }
});
exports.authMiddleware = authMiddleware;
