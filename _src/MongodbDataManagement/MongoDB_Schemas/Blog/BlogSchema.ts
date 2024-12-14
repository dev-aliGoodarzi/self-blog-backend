import mongoose from "mongoose";

export type T_BlogComments = {
  commentTitle: string;
  commentBody: string;
  writerId: string;
  isPublished: boolean;
};

export type T_BlogLikes = {
  userId: string;
};

export type T_BlogSchema = {
  title: string;
  innerHTML: string;
  rating: number[]; // 1 - 5
  isPublished: boolean;
  publisherEmail: string;
  blogId: string;
  createDate: string;
  fullDate: string;
  tags: string[];
  comments: T_BlogComments[];
  likes: T_BlogLikes[];
};

export const BlogSchema = new mongoose.Schema<T_BlogSchema>({
  title: String,
  innerHTML: String,
  rating: [Number],
  isPublished: Boolean,
  publisherEmail: String,
  blogId: String,
  tags: [String],
  createDate: String,
  fullDate: String,
  likes: [
    {
      userId: String,
    },
  ],
  comments: [
    {
      commentTitle: String,
      writerId: String,
      commentBody: String,
      isPublished: Boolean,
    },
  ],
});
