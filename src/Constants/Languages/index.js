"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWordBasedOnCurrLang = void 0;
// Types
const ReturnAsDesiredType_1 = require("../../Utils/TypeReturners/ReturnAsDesiredType");
// Types
// Language Data
const en_lang_1 = require("./en/en_lang");
const fa_lang_1 = require("./fa/fa_lang");
// Language Data
const getWordBasedOnCurrLang = (language, desiredWord) => {
    const desiredKey = (0, ReturnAsDesiredType_1.ReturnAsDesiredType)(desiredWord, "string");
    if (language === "fa") {
        return fa_lang_1.fa_lang[desiredKey] || `NOT_FOUND_IN_LANGUAGE__FA__${desiredKey}`;
    }
    if (language === "en") {
        return en_lang_1.en_lang[desiredKey] || `NOT_FOUND_IN_LANGUAGE__EN__${desiredKey}`;
    }
    return `NOT_FOUND_IN_LANGUAGE__${language}`;
};
exports.getWordBasedOnCurrLang = getWordBasedOnCurrLang;
