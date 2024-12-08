type T_Formats = "email" | "password" | "removeScriptRegEx";

export const formats: {
  [key in T_Formats]: RegExp;
} = {
  email: /^\S+@\S+\.\S+$/,
  password: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  removeScriptRegEx: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
};
