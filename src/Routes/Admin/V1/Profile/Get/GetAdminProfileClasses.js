"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfileClasses = void 0;
// Express
// Middlewares
const notFoundCurrentUser_1 = require("../../Auth/Middlewares/notFoundCurrentUser");
// Middlewares
// Models
const UserModel_1 = require("../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel");
const DoneStatusCode_1 = require("../../../../../Constants/Done/DoneStatusCode");
const Languages_1 = require("../../../../../Constants/Languages");
// Models
class GetProfileClasses {
    static getCurrentAdminProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = req.headers.language;
            const { userEmail } = req;
            const desierdUser = yield UserModel_1.AdminUserModel.findOne({
                email: userEmail,
            });
            if (!desierdUser) {
                (0, notFoundCurrentUser_1.notFoundCurrentUser)({ req, res });
                return;
            }
            const _a = desierdUser.toJSON(), { password, userToken, refreshToken, _id } = _a, others = __rest(_a, ["password", "userToken", "refreshToken", "_id"]);
            res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).json({
                message: (0, Languages_1.getWordBasedOnCurrLang)(language, "successful"),
                data: others,
            });
        });
    }
}
exports.GetProfileClasses = GetProfileClasses;
