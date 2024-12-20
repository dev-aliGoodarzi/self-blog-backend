"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currMode = void 0;
// Express
const express_1 = __importDefault(require("express"));
// Express
// Routes
const AdminRoutesIndex_1 = require("./Routes/Admin/AdminRoutesIndex");
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const languageTypes_1 = require("./Constants/Languages/languageTypes");
// Routes
// Configs
require("dotenv").config();
// Configs
// Modules
const path_1 = __importDefault(require("path"));
// Modules
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
// #region #init
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "*" }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
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
app.use("/uploads/blog-images", express_1.default.static("uploads/blog-images"));
app.use("/uploads/user-avatars", express_1.default.static("uploads/user-avatars"));
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
        if (!languageTypes_1.languagesArray.includes(language)) {
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
app.use("/swagger-static-files", express_1.default.static(path_1.default.join(__dirname, "../Swagger/Admin/CSS")));
//
app.use("/documentation/admin/swagger-ui", (req, res, next) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
}, swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(require("./../Swagger/Admin/AdminSwagger.json"), {
    explorer: true,
    customJs: "/swagger-static-files/custom-js.js",
}));
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
app.use("/admin", AdminRoutesIndex_1.AdminRoutes);
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
exports.currMode = process.env.NODE_ENV === "production" ? "prod" : "dev";
const mongodbURI = exports.currMode === "dev"
    ? process.env.MONGODB_CONNECTION_STRING_LOCAL
    : process.env.MONGODB_CONNECTION_STRING_PROD;
let dbStatus = {
    isConnected: false,
    url: exports.currMode === "prod"
        ? mongodbURI.split("").splice(0, 10).join("")
        : mongodbURI,
    mongoError: "",
};
mongoose_1.default
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
