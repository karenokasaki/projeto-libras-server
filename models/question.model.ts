import mongoose, { Model } from "mongoose";
import type { QuestionDoc } from "../types";

const questionSchema = new mongoose.Schema<QuestionDoc>(
  {
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
    level: {
      type: String,
      required: true,
      enum: ["fácil", "médio", "difícil"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const QuestionModel: Model<QuestionDoc> = mongoose.model(
  "Question",
  questionSchema
);

export default QuestionModel;
