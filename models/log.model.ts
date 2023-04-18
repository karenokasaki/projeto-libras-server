import mongoose, { Document, Model } from "mongoose";
import type { UserDoc, QuestionDoc } from "../types";

type LogAction = "acertou" | "errou";

interface LogDoc extends Document {
  user: UserDoc["_id"];
  question: QuestionDoc["_id"];
  action: LogAction;
  createdAt: any;
  updatedAt: any;
  points: number;
}

const logSchema = new mongoose.Schema<LogDoc>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    action: { type: String, required: true },
    points: { type: Number, required: true },
  },
  { timestamps: true }
);

const LogModel: Model<LogDoc> = mongoose.model("Log", logSchema);

export default LogModel;
