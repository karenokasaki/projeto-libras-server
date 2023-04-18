import express, { Request, Response } from "express";
import { uploadImg } from "../config/cloudinary.config.js";

const cloudinary = express.Router();

cloudinary.post(
  "/",
  uploadImg.single("file"),
  (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    if (!req.file) {
      return res.status(400).json({ msg: "Upload fail" });
    }

    return res.status(201).json({ url: req.file.path });
  }
);

export default cloudinary;
