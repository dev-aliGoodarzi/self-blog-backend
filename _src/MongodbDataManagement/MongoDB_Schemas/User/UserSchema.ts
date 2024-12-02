// Mongoose
import mongoose from "mongoose";
// Mongoose

// Schemas
import { BlogSchema, T_BlogSchema } from "../Blog/BlogSchema";
// Schemas

export type T_BasicUserData = {
  name: string;
  lastName: string;
  email: string;
};

export type T_AdminExtraData = {
  image: string;
};

export type T_UserSchema = T_BasicUserData &
  T_AdminExtraData & {
    password: string;
    userToken: string;
    refreshToken: string;
    userId: string;
    isRegisterCompleted: boolean;
    blogs: T_BlogSchema[];
    role: "ADMIN" | "NORMAL_USER";
  };

export const UserSchema = new mongoose.Schema<T_UserSchema>({
  name: String,
  lastName: String,
  email: String,
  password: String,
  userToken: String,
  refreshToken: String,
  userId: String,
  isRegisterCompleted: Boolean,
  blogs: [BlogSchema],
  image: String,
  role: String, // ADMIN | NORMAL_USER
});
