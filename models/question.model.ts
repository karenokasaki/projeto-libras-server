import mongoose, { Model } from "mongoose";
import type { QuestionDoc } from "../types";

const questionSchema = new mongoose.Schema<QuestionDoc>(
  {
    type: { type: String, required: true },
    heading: { type: String, required: true },
    questions: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true },
    attach: { type: String },
    level: { type: String, required: true },
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
