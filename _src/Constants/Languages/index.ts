// Types
import { ReturnAsDesiredType } from "../../Utils/TypeReturners/ReturnAsDesiredType";
import { T_LanguageKeys, T_ValidLanguages } from "./languageTypes";
// Types

// Language Data
import { en_lang } from "./en/en_lang";
import { fa_lang } from "./fa/fa_lang";
// Language Data

export const getWordBasedOnCurrLang = (
  language: T_ValidLanguages,
  desiredWord: T_LanguageKeys
) => {
  const desiredKey = ReturnAsDesiredType(
    desiredWord,
    "string"
  ) as T_LanguageKeys;
  if (language === "fa") {
    return fa_lang[desiredKey] || `NOT_FOUND_IN_LANGUAGE__FA__${desiredKey}`;
  }
  if (language === "en") {
    return en_lang[desiredKey] || `NOT_FOUND_IN_LANGUAGE__EN__${desiredKey}`;
  }
  return `NOT_FOUND_IN_LANGUAGE__${language}`;
};
