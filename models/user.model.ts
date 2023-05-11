import mongoose, { Document, Model } from "mongoose";
import type { UserDoc } from "../types";

const userSchema = new mongoose.Schema<UserDoc>(
  {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    allowMedium: { type: Boolean, default: false },
    allowHard: { type: Boolean, default: false },

    age: { type: String },
    surdo: { type: Boolean },
  },
  { timestamps: true }
);

const UserModel: Model<UserDoc> = mongoose.model("User", userSchema);

export default UserModel;
