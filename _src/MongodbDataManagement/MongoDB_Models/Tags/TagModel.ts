// Express
import mongoose from "mongoose";
// Express

// Schema
import { TagsSchema } from "../../MongoDB_Schemas/Tags/TagsSchema";
// Schema

export type T_TagModel = {
  title: string;
  value: string;
};

export const TagModel = mongoose.model("tags", TagsSchema);
