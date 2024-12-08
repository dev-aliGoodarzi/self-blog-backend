// Express
import mongoose from "mongoose";
// Express

// Models
import { T_TagModel } from "../../MongoDB_Models/Tags/TagModel";
// Models

export const TagsSchema = new mongoose.Schema<T_TagModel>({
  title: String,
  value: String,
});
