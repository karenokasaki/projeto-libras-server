import express, { Request, Response } from "express";
import { generateToken } from "../config/jwt.config";
import isAuth from "../middlewares/isAuth";
import attachCurrentUser from "../middlewares/attachCurrentUser";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import { AuthenticatedRequest, UserDoc } from "../types";

const SALT_ROUNDS = 10;

const userRouter = express.Router();

userRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    //checar se a senha tem pelo menos 8 caracteres
    if (!password || !password.match(/.{8,}/)) {
      return res.status(400).json({
        msg: "Email ou senha invalidos. Verifique se ambos atendem as requisições.",
      });
    }

    if (password === process.env.CREATE_ADMIN) {
      req.body.role = "ADMIN";
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    const user = {
      name: createdUser.name,
      email: createdUser.email,
      _id: createdUser._id,
      role: createdUser.role,
    };

    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

userRouter.post("/login", async (req: Request, res: Response) => {
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
          role: user.role,
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

userRouter.get(
  "/profile",
  isAuth,
  attachCurrentUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.currentUser) {
        return res.status(401).json({ msg: "Usuário não autenticado." });
      }
      const user: UserDoc = req.currentUser;

      if (!user) {
        return res
          .status(404)
          .json({ msg: "Usuário não encontrado.", ok: false });
      }

      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

//update
userRouter.put(
  "/profile",
  isAuth,
  attachCurrentUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.currentUser) {
        return res
          .status(401)
          .json({ msg: "Usuário não autenticado.", ok: false });
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        req.currentUser._id,
        { ...req.body },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ msg: "Usuário não encontrado.", ok: false });
      }

      return res.status(200).json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

//delete user
userRouter.delete(
  "/profile",
  isAuth,
  attachCurrentUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.currentUser) {
        return res
          .status(401)
          .json({ msg: "Usuário não autenticado.", ok: false });
      }
      const deletedUser = await UserModel.findByIdAndDelete(
        req.currentUser._id
      );

      if (!deletedUser) {
        return res
          .status(404)
          .json({ msg: "Usuário não encontrado.", ok: false });
      }

      return res
        .status(200)
        .json({ ok: true, msg: "Usuário deletado com sucesso" });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

export default userRouter;
