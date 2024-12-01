import mongoose from "mongoose";

export type T_BlogComments = {
  commentTitle: string;
  commentBody: string;
  writerId: string;
  isPublished: boolean;
};

export type T_BlogSchema = {
  title: string;
  innerHTML: string;
  rating: number; // 1 - 5
  comments: T_BlogComments[];
};

export const BlogSchema = new mongoose.Schema<T_BlogSchema>({
  title: String,
  innerHTML: String,
  rating: Number,
  comments: [
    {
      commentTitle: String,
      writerId: String,
      commentBody: String,
      isPublished: Boolean,
    },
  ],
});
