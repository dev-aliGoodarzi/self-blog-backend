// Mongoose
import mongoose from "mongoose";
// Mongoose

// Schemas
import { UserSchema } from "../../MongoDB_Schemas/User/UserSchema";
// Schemas

export const AdminUserModel = mongoose.model("admin_users", UserSchema);
