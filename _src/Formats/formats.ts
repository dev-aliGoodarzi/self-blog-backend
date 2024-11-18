type T_Formats = "email" | "password";

export const formats: {
  [key in T_Formats | string]: RegExp;
} = {
  email: /^\S+@\S+\.\S+$/,
  password: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};
