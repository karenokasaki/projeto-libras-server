import { Document } from "mongoose";
import { Request } from "express";

type Params = {
  folder: string;
  format: string[];
  use_filename: boolean;
};

type UserDoc = Document & {
  name: string;
  email: string;
  passwordHash: string;
  points: number;
  profilePic: string;
  role: string;
  questions: QuestionModel["_id"][];
  allowMedium: boolean;
  allowHard: boolean;
};

type QuestionDoc = Document & {
  type: string;
  heading: string;
  questions: string;
  options: string[];
  answer: string;
  attach?: string;
  level: string;
  createdBy: UserDoc["_id"];
  category: string;
};

type AuthenticatedRequest = Request & {
  currentUser?: UserDoc; // ou o tipo que representa o usuário
};
