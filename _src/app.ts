// Express
import express from "express";
// Express

// Routes
import { AdminRoutes } from "./Routes/Admin/AdminRoutesIndex";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {
  languagesArray,
  T_ValidLanguages,
} from "./Constants/Languages/languageTypes";
// Routes

// Configs
require("dotenv").config();
// Configs

// Modules
import path from "path";
// Modules

import swaggerUi from "swagger-ui-express";
import cors from "cors";
// #region #init
const app = express();
app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// #region Middlewares
app.use((bodyParser as any).json());
app.use((bodyParser as any).urlencoded({ extended: true }));
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// #region StaticServes
app.use("/uploads/blog-images", express.static("uploads/blog-images"));
app.use("/uploads/user-avatars", express.static("uploads/user-avatars"));
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// #region Language Middleware
app.use((req, res, next) => {
  const language = req.headers.language;
  if (typeof language === "undefined") {
    req.headers.language = "en";
  }
  if (typeof language === "string") {
    if (!languagesArray.includes(language as T_ValidLanguages)) {
      req.headers.language = "en";
    }
  }
  next();
});
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// #region BaseRoute
app.get("/", (_, res) => {
  res.status(200).json({
    message: "Server Works Normally ",
  });
});
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// #region CacheReset
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// #region API DOCUMENTS
app.use(
  "/swagger-static-files",
  express.static(path.join(__dirname, "../Swagger/Admin/CSS"))
);
//
app.use(
  "/documentation/admin/swagger-ui",
  (req: any, res: any, next: any) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(require("./../Swagger/Admin/AdminSwagger.json"), {
    explorer: true,
    customJs: "/swagger-static-files/custom-js.js",
  })
);
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// #region AdminRoutes
app.use("/admin", AdminRoutes);
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// #region Mongoose
export const currMode: "prod" | "dev" =
  process.env.NODE_ENV === "production" ? "prod" : "dev";
const mongodbURI =
  currMode === "dev"
    ? process.env.MONGODB_CONNECTION_STRING_LOCAL!
    : process.env.MONGODB_CONNECTION_STRING_PROD!;

let dbStatus = {
  isConnected: false,
  url:
    currMode === "prod"
      ? mongodbURI.split("").splice(0, 10).join("")
      : mongodbURI,
  mongoError: "",
};
mongoose
  .connect(mongodbURI)
  .then(() => {
    console.log(`Mongodb Connected on ${mongodbURI}`);
  })
  .catch((err) => {
    console.log(err);
    dbStatus.isConnected = false;
    dbStatus.mongoError = JSON.stringify(err);
  });
/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// #region Server Run
app.listen(process.env.LISTEN_PORT, () => {
  console.log(`Server Runs On Port ${process.env.LISTEN_PORT}`);
});
