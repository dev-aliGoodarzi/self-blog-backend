"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// #region #init
const app = (0, express_1.default)();
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
// #region API DOCUMANTS
app.use("/documentation/swagger-ui", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(require("./../Swagger/SwaggerJson.json"), {
    explorer: true,
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
// #region AdminRoutes V1
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
const currMode = process.env.NODE_ENV === "production" ? "prod" : "dev";
const mongodbURI = currMode === "dev"
    ? process.env.MONGODB_CONNECTION_STRING_LOCAL
    : process.env.MONGODB_CONNECTION_STRING_PROD;
let dbStatus = {
    isConnected: false,
    url: currMode === "prod"
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
