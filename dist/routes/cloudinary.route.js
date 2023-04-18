"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cloudinary_config_js_1 = require("../config/cloudinary.config.js");
const cloudinary = express_1.default.Router();
cloudinary.post("/", cloudinary_config_js_1.uploadImg.single("picture"), (req, res) => {
    console.log(req);
    res.header("Access-Control-Allow-Origin", "*");
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "Upload fail" });
        }
        return res.status(201).json({ url: req.file.path });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
});
exports.default = cloudinary;
