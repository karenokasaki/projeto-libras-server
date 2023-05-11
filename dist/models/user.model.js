"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm,
    },
    passwordHash: { type: String, required: true },
    points: { type: Number, default: 0 },
    profilePic: { type: String },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN", "USER"],
        default: "USER",
    },
    questions: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Question",
        },
    ],
    allowMedium: { type: Boolean, default: false },
    allowHard: { type: Boolean, default: false },
    age: { type: String },
    surdo: { type: Boolean },
    city: { type: String },
}, { timestamps: true });
const UserModel = mongoose_1.default.model("User", userSchema);
exports.default = UserModel;
