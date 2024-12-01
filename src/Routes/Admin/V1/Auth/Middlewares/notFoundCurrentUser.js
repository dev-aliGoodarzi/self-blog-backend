"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundCurrentUser = void 0;
// Express
// Constants
const ErrorSenderToClient_1 = require("../../../../../Constants/Errors/ErrorSenderToClient");
const ErrorsStatusCode_1 = require("../../../../../Constants/Errors/ErrorsStatusCode");
const Languages_1 = require("../../../../../Constants/Languages");
// Constants
const notFoundCurrentUser = (pipeData) => {
    const language = pipeData.req.headers.language;
    (0, ErrorSenderToClient_1.ErrorSenderToClient)({
        data: {},
        expectedType: "string",
        errorData: {
            errorKey: "NOT_FOUND_USER",
            errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "notExistedUser"),
        },
    }, ErrorsStatusCode_1.ErrorsStatusCode.notAuthorized.standardStatusCode, pipeData.res);
};
exports.notFoundCurrentUser = notFoundCurrentUser;
