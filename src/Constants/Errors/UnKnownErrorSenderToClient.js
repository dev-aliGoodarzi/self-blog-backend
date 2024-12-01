"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnKnownErrorSenderToClient = void 0;
// Express
// ErrorSender
const ErrorSenderToClient_1 = require("./ErrorSenderToClient");
// ErrorSender
// Languages
const Languages_1 = require("../Languages");
// Languages
// StatusCodes
const ErrorsStatusCode_1 = require("./ErrorsStatusCode");
// StatusCodes
const UnKnownErrorSenderToClient = (pipeData, err) => {
    const language = pipeData.req.headers.language;
    (0, ErrorSenderToClient_1.ErrorSenderToClient)({
        data: err,
        errorData: {
            errorKey: "",
            errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "unKnownError"),
        },
        expectedType: "string",
    }, ErrorsStatusCode_1.ErrorsStatusCode.notAcceptable.standardStatusCode, pipeData.res);
    console.log(err);
};
exports.UnKnownErrorSenderToClient = UnKnownErrorSenderToClient;
