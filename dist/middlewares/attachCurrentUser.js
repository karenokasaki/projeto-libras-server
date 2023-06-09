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
const user_model_1 = __importDefault(require("../models/user.model"));
function attachCurrentUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userData = req.auth;
            console.log(userData);
            const user = yield user_model_1.default.findOne({ _id: userData._id }, { passwordHash: 0 });
            if (!user) {
                return res.status(404).json({ msg: "User not found." });
            }
            req.currentUser = user;
            next();
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });
}
exports.default = attachCurrentUser;
