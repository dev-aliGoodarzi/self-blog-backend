// Express
import express from "express";
import { TagManagerClasses } from "./TagManagerClasses/TagManagerClasses";
// Express

export const TagManagerRoutes = express.Router();

TagManagerRoutes.get(`/tags`, TagManagerClasses.getAllTags);
