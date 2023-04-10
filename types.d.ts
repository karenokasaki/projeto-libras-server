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
};

type AdminDoc = Document & {
  name: string;
  email: string;
  password: string;
  questions: QuestionModel["_id"][];
};

type QuestionDoc = Document & {
  type: string;
  heading: string;
  questions: string;
  options: string[];
  answer: string;
  attach?: string;
  level: string;
  createdBy: AdminDoc["_id"];
};

type AuthenticatedRequest = Request & {
  currentUser?: UserDoc; // ou o tipo que representa o usuário
};
