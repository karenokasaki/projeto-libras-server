import express, { Request, Response } from "express";
import { generateToken } from "../config/jwt.config";
import isAuth from "../middlewares/isAuth";
import attachCurrentUser from "../middlewares/attachCurrentUser";
import UserModel from "../models/user.model";

import bcrypt from "bcrypt";
import AdminModel from "../models/admin.model";
import { AuthenticatedRequest } from "../types";

const SALT_ROUNDS = 10;

const adminRouter = express.Router();

adminRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    //checar se a senha tem pelo menos 8 caracteres
    if (!password || !password.match(/.{8,}/)) {
      return res.status(400).json({
        msg: "Email ou senha invalidos. Verifique se ambos atendem as requisições.",
      });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    const hashedPassword = await bcrypt.hash(password, salt);

    const createdAdmin = await AdminModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    const user = {
      name: createdAdmin.name,
      email: createdAdmin.email,
      _id: createdAdmin._id,
    };

    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

adminRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ msg: "Email ou senha invalidos." });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      const token = generateToken(user);

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
          type: "ADMIN",
        },
        token: token,
      });
    } else {
      return res.status(401).json({ msg: "Email ou senha invalidos." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

adminRouter.get(
  "/me",
  isAuth,
  attachCurrentUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.currentUser) {
        return res.status(401).json({ msg: "Você não está autenticado" });
      }
      const user = req.currentUser;
      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

export default adminRouter;
