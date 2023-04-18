import express, { Request, Response } from "express";
import { uploadImg } from "../config/cloudinary.config.js";

const cloudinary = express.Router();

cloudinary.post(
  "/",
  uploadImg.single("picture"),
  (req: Request, res: Response) => {
    console.log(req);
    res.header("Access-Control-Allow-Origin", "*");
    try {
      if (!req.file) {
        return res.status(400).json({ msg: "Upload fail" });
      }

      return res.status(201).json({ url: req.file.path });
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);

export default cloudinary;
