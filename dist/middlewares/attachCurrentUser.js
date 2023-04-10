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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_model_1 = __importDefault(require("../models/admin.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
function attachCurrentUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userData = req.auth;
            if (userData.type === "USER") {
                const user = yield user_model_1.default.findOne({ _id: userData._id }, { passwordHash: 0 });
                if (!user) {
                    return res.status(404).json({ msg: "User not found." });
                }
                req.currentUser = user;
            }
            if (userData.type === "ADMIN") {
                const admin = yield admin_model_1.default.findOne({ _id: userData._id }, { passwordHash: 0 });
                if (!admin) {
                    return res.status(404).json({ msg: "Admin not found." });
                }
                req.currentUser = admin;
            }
            next();
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });
}
exports.default = attachCurrentUser;
