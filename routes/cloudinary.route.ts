import express, { Request, Response } from "express";
import { uploadImg } from "../config/cloudinary.config.js";

const cloudinary = express.Router();

cloudinary.post(
  "/",
  uploadImg.single("picture"),
  (req: Request, res: Response) => {
    if (!req.file) {
      console.log(req.file);
      return res.status(400).json({ msg: "Upload fail" });
    }

    return res.status(201).json({ url: req.file.path });
  }
);

export default cloudinary;
