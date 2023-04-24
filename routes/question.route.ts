import express, { Response } from "express";
import QuestionModel from "../models/question.model";
import isAuth from "../middlewares/isAuth";
import { isAdmin } from "../middlewares/isAdmin";
import { AuthenticatedRequest } from "../types";
import attachCurrentUser from "../middlewares/attachCurrentUser";
import UserModel from "../models/user.model";

const QuestionRouter = express.Router();

/* ONLY ADMIN */

// CREATE
QuestionRouter.post(
  "/create",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.currentUser) {
        return res.status(401).json({ msg: "Não autorizado" });
      }
      // cria a pergunta
      const question = await QuestionModel.create({
        createdBy: req.currentUser._id,
        ...req.body,
      });

      // faz o push da pergunta criada para a array de perguntas do admin
      const userAdmin = await UserModel.findById(req.currentUser._id);
      if (!userAdmin) {
        return res.status(404).json({ msg: "Admin não encontrado" });
      }
      userAdmin.questions.push(question._id);
      await userAdmin.save();

      return res.status(201).json(question);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

// UPDATE
QuestionRouter.put(
  "/:id",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const question = await QuestionModel.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!question) {
        return res.status(404).json({ msg: "Pergunta não encontrada" });
      }
      return res.status(200).json(question);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

// DELETE
QuestionRouter.delete(
  "/:id",
  isAuth,
  attachCurrentUser,
  isAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const question = await QuestionModel.findByIdAndDelete(req.params.id);
      if (!question) {
        return res.status(404).json({ msg: "Pergunta não encontrada" });
      }
      return res.status(204).json();
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

/* USERS */
// READ ALL
QuestionRouter.get(
  "/get-all",
  isAuth,
  attachCurrentUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const questions = await QuestionModel.find();
      return res.status(200).json(questions);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

// READ ONE
QuestionRouter.get(
  "/:id",
  isAuth,
  attachCurrentUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const question = await QuestionModel.findById(req.params.id);
      if (!question) {
        return res.status(404).json({ msg: "Pergunta não encontrada" });
      }
      return res.status(200).json(question);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

// GET BY LEVEL
QuestionRouter.get(
  "/get-by-level/:level",
  isAuth,
  attachCurrentUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const questions = await QuestionModel.find({ level: req.params.level });
      if (!questions) {
        return res.status(404).json({ msg: "Perguntas não encontradas" });
      }
      return res.status(200).json(questions);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

//get by category
QuestionRouter.get(
  "/get-by-category/:category",
  isAuth,
  attachCurrentUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const questions = await QuestionModel.find({
        category: req.params.category,
      });
      if (!questions) {
        return res.status(404).json({ msg: "Perguntas não encontradas" });
      }
      return res.status(200).json(questions);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

export default QuestionRouter;
