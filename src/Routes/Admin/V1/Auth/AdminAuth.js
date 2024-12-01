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
exports.AdminAuth = void 0;
// Express
const express_1 = require("express");
// Express
// AuthValidator
const _auth_classes_1 = require("./_classes/_auth_classes");
// AuthValidator
// Constants
const ErrorsStatusCode_1 = require("../../../../Constants/Errors/ErrorsStatusCode");
const ErrorSenderToClient_1 = require("../../../../Constants/Errors/ErrorSenderToClient");
const Languages_1 = require("../../../../Constants/Languages");
// Constants
// Services
const _auth_services_1 = require("./_classes/_auth_services");
const authMiddleware_1 = require("./Middlewares/authMiddleware");
const UserModel_1 = require("../../../../MongodbDataManagement/MongoDB_Models/User/UserModel");
const checkIsNull_1 = require("../../../../Validators/checkIsNull");
const DoneStatusCode_1 = require("../../../../Constants/Done/DoneStatusCode");
const UnKnownErrorSenderToClient_1 = require("../../../../Constants/Errors/UnKnownErrorSenderToClient");
// Services
exports.AdminAuth = (0, express_1.Router)();
exports.AdminAuth.post("/auth-register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const language = req.headers.language;
    try {
        const receivedDataErrors = _auth_classes_1._auth_classes.registerUserDataValidate(req);
        if (receivedDataErrors.hasError === true) {
            (0, ErrorSenderToClient_1.ErrorSenderToClient)(receivedDataErrors.errorData, ErrorsStatusCode_1.ErrorsStatusCode.notAcceptable.standardStatusCode, res);
            return;
        }
        const canRegisterCurrentEmailAndPassword = yield _auth_classes_1._auth_classes.canRegisterCurrentEmailAndPassword(req);
        if (canRegisterCurrentEmailAndPassword === false) {
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
        _auth_services_1._auth_services.registerUser(req.body.email, req.body.password, {
            req,
            res,
        });
    }
    catch (err) {
        console.log(err);
    }
}));
exports.AdminAuth.post("/auth-login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const language = req.headers.language;
    const receivedDataErrors = _auth_classes_1._auth_classes.registerUserDataValidate(req);
    if (receivedDataErrors.hasError === true) {
        (0, ErrorSenderToClient_1.ErrorSenderToClient)(receivedDataErrors.errorData, ErrorsStatusCode_1.ErrorsStatusCode.notAcceptable.standardStatusCode, res);
        return;
    }
    const canLoginCurrentEmailAndPassword = yield _auth_classes_1._auth_classes.canLoginCurrentEmailAndPassword(req);
    if (canLoginCurrentEmailAndPassword === false) {
        (0, ErrorSenderToClient_1.ErrorSenderToClient)({
            data: {},
            errorData: {
                errorKey: "",
                errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "userNotExist"),
            },
            expectedType: "string",
        }, ErrorsStatusCode_1.ErrorsStatusCode.duplicate.standardStatusCode, res);
        return;
    }
    yield _auth_services_1._auth_services.loginWithEmailAndPassword({
        req,
        res,
    });
}));
exports.AdminAuth.post("/auth-resubmit-user-auth", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const language = req.headers.language;
    const { body } = req;
    const keys = Object.keys(body);
    try {
        const desiredUser = yield UserModel_1.AdminUserModel.findOne({
            email: req.userEmail,
        });
        if (desiredUser.isRegisterCompleted) {
            (0, ErrorSenderToClient_1.ErrorSenderToClient)({
                data: {},
                errorData: {
                    errorKey: "",
                    errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "alreadyDone"),
                },
                expectedType: "string",
            }, ErrorsStatusCode_1.ErrorsStatusCode.notAcceptable.standardStatusCode, res);
            return;
        }
        else {
            const errors = {};
            const desiredKeys = ["name", "lastName"];
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
                return;
            }
            desiredUser.name = body["name"];
            desiredUser.lastName = body["lastName"];
            desiredUser.isRegisterCompleted = true;
            yield desiredUser.save();
            res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                message: (0, Languages_1.getWordBasedOnCurrLang)(language, "userAuthCompleted"),
            });
        }
    }
    catch (err) {
        (0, UnKnownErrorSenderToClient_1.UnKnownErrorSenderToClient)({ req, res }, err);
    }
}));
