type T_Formats = "email" | "password" | "removeScriptRegEx" | "date";

export const formats: {
  [key in T_Formats]: RegExp;
} = {
  email: /^\S+@\S+\.\S+$/,
  password: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  removeScriptRegEx: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  date: /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/,
};
