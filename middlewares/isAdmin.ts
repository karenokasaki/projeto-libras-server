//todo add type for user

import { NextFunction, Response } from "express";
import AdminModel from "../models/admin.model";
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
    const admin = await AdminModel.findById(req.currentUser._id);
    if (!admin) {
      return res.status(401).json({ msg: "User unauthorized." });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}
