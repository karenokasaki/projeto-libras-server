"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    question: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    action: { type: String, required: true },
    points: { type: Number, required: true },
}, { timestamps: true });
const LogModel = mongoose_1.default.model("Log", logSchema);
exports.default = LogModel;
