"use strict";
//todo add type for user
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
exports.isAdmin = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
function isAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.currentUser) {
                return res.status(401).json({ msg: "User not logged in." });
            }
            const userAdmin = yield user_model_1.default.findById(req.currentUser._id);
            if (!userAdmin) {
                return res.status(404).json({ msg: "User not found." });
            }
            if (userAdmin.role !== "ADMIN") {
                return res.status(401).json({ msg: "User unauthorized." });
            }
            next();
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });
}
exports.isAdmin = isAdmin;
