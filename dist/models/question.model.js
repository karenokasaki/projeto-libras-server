"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const questionSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        required: true,
        enum: [
            "monte a palavra",
            "clique na imagem",
            "complete a palavra",
            "escolha a frase",
            "escreva a palavra",
            "complete a frase",
            "clique no video",
        ],
    },
    heading: { type: String, required: true },
    questions: { type: String, required: true },
    options: [{ type: String }],
    answer: { type: String, required: true },
    attach: { type: String },
    level: { type: String, required: true },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },
}, { timestamps: true });
const QuestionModel = mongoose_1.default.model("Question", questionSchema);
exports.default = QuestionModel;
