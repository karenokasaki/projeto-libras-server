"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//todo add type for user
function generateToken(user) {
    const { _id, name, email, type } = user;
    if (process.env.TOKEN_SIGN_SECRET === undefined) {
        throw new Error("TOKEN_SIGN_SECRET is undefined");
    }
    const signature = process.env.TOKEN_SIGN_SECRET;
    const expiration = "12h";
    return jsonwebtoken_1.default.sign({ _id, name, email, type }, signature, {
        expiresIn: expiration,
    });
}
exports.generateToken = generateToken;
