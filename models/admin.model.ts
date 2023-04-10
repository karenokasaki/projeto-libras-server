import mongoose, { Document, Model } from "mongoose";

import type { AdminDoc } from "../types";

const adminSchema = new mongoose.Schema<AdminDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

const AdminModel: Model<AdminDoc> = mongoose.model("Admin", adminSchema);

export default AdminModel;
