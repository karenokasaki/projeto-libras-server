import cloudinary from "cloudinary";

import { CloudinaryStorage } from "multer-storage-cloudinary";

import multer from "multer";

import * as dotenv from "dotenv";
import type { Params } from "../types";

dotenv.config();

const cloudinaryInst = cloudinary.v2;

cloudinaryInst.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//create type params

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryInst,
  params: <Params>{
    folder: "projeto-libras",
    format: ["jpg", "png"],
    use_filename: true,
  },
});

const uploadImg = multer({ storage: storage });

export { uploadImg };
