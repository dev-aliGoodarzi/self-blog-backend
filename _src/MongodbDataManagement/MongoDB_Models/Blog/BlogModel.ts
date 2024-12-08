// Mongoose
import mongoose from "mongoose";
// Mongoose

// Schema
import { BlogSchema } from "../../MongoDB_Schemas/Blog/BlogSchema";
// Schema

export const BlogModel = mongoose.model("blogs", BlogSchema);
