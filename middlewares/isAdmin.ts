//todo add type for user

import { NextFunction, Response } from "express";
import UserModel from "../models/user.model";
import { AuthenticatedRequest } from "../types";

export async function isAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.currentUser) {
      return res.status(401).json({ msg: "User not logged in." });
    }

    const userAdmin = await UserModel.findById(req.currentUser._id);
    if (!userAdmin) {
      return res.status(404).json({ msg: "User not found." });
    }

    if (userAdmin.role !== "ADMIN") {
      return res.status(401).json({ msg: "User unauthorized." });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}
