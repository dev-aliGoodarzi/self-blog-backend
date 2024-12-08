export type T_Fa_Lang = "fa";
export type T_En_Lang = "en";

export type T_ValidLanguages = T_Fa_Lang | T_En_Lang;

export const languagesArray: T_ValidLanguages[] = ["fa", "en"];

export type T_LanguageKeys =
  | "successful"
  | "wrongType"
  | "emailFormatError"
  | "passwordFormatError"
  | "duplicateUser"
  | "unExpectedError"
  | "userAdminRegisterCompleted"
  | "userNotExist"
  | "notEqualPassword"
  | "operationSuccess"
  | "alreadyDone"
  | "noToken"
  | "notExistedUser"
  | "unKnownError"
  | "userAuthCompleted"
  | "thisEmailAlreadyExists"
  | "tagsMissMatch"
  | "expiredToken"
  | "resetPasswordEmailSend"
  | "lengthIsLittleThanDesire"
  | "notAuthCompleted"
  | "notFoundDesiredBlog";
