"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_config_1 = require("../config/jwt.config");
const isAuth_1 = __importDefault(require("../middlewares/isAuth"));
const attachCurrentUser_1 = __importDefault(require("../middlewares/attachCurrentUser"));
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const admin_model_1 = __importDefault(require("../models/admin.model"));
const SALT_ROUNDS = 10;
const adminRouter = express_1.default.Router();
adminRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        //checar se a senha tem pelo menos 8 caracteres
        if (!password || !password.match(/.{8,}/)) {
            return res.status(400).json({
                msg: "Email ou senha invalidos. Verifique se ambos atendem as requisições.",
            });
        }
        const salt = yield bcrypt_1.default.genSalt(SALT_ROUNDS);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const createdAdmin = yield admin_model_1.default.create(Object.assign(Object.assign({}, req.body), { passwordHash: hashedPassword }));
        const user = {
            name: createdAdmin.name,
            email: createdAdmin.email,
            _id: createdAdmin._id,
        };
        return res.status(201).json(user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
adminRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ msg: "Email ou senha invalidos." });
        }
        if (yield bcrypt_1.default.compare(password, user.passwordHash)) {
            const token = (0, jwt_config_1.generateToken)(user);
            return res.status(200).json({
                user: {
                    name: user.name,
                    email: user.email,
                    _id: user._id,
                    type: "ADMIN",
                },
                token: token,
            });
        }
        else {
            return res.status(401).json({ msg: "Email ou senha invalidos." });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
adminRouter.get("/me", isAuth_1.default, attachCurrentUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.currentUser) {
            return res.status(401).json({ msg: "Você não está autenticado" });
        }
        const user = req.currentUser;
        return res.status(200).json(user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
exports.default = adminRouter;
