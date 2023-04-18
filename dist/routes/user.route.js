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
const log_model_1 = __importDefault(require("../models/log.model"));
const SALT_ROUNDS = 10;
const userRouter = express_1.default.Router();
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const salt = yield bcrypt_1.default.genSalt(SALT_ROUNDS);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const createdUser = yield user_model_1.default.create(Object.assign(Object.assign({}, req.body), { passwordHash: hashedPassword }));
        const user = {
            name: createdUser.name,
            email: createdUser.email,
            _id: createdUser._id,
            role: createdUser.role,
        };
        return res.status(201).json(user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                    role: user.role,
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
userRouter.get("/profile", isAuth_1.default, attachCurrentUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.currentUser) {
            return res.status(401).json({ msg: "Usuário não autenticado." });
        }
        const user = req.currentUser;
        if (!user) {
            return res
                .status(404)
                .json({ msg: "Usuário não encontrado.", ok: false });
        }
        return res.status(200).json(user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
//update
userRouter.put("/profile", isAuth_1.default, attachCurrentUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.currentUser) {
            return res
                .status(401)
                .json({ msg: "Usuário não autenticado.", ok: false });
        }
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(req.currentUser._id, Object.assign({}, req.body), { new: true });
        if (!updatedUser) {
            return res
                .status(404)
                .json({ msg: "Usuário não encontrado.", ok: false });
        }
        return res.status(200).json(updatedUser);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
//delete user
userRouter.delete("/profile", isAuth_1.default, attachCurrentUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.currentUser) {
            return res
                .status(401)
                .json({ msg: "Usuário não autenticado.", ok: false });
        }
        const deletedUser = yield user_model_1.default.findByIdAndDelete(req.currentUser._id);
        if (!deletedUser) {
            return res
                .status(404)
                .json({ msg: "Usuário não encontrado.", ok: false });
        }
        return res
            .status(200)
            .json({ ok: true, msg: "Usuário deletado com sucesso" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
//add points
userRouter.get("/add-points/:idQuestion", isAuth_1.default, attachCurrentUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.currentUser) {
            return res
                .status(401)
                .json({ msg: "Usuário não autenticado.", ok: false });
        }
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(req.currentUser._id, { $inc: { points: 1 } }, { new: true });
        if (!updatedUser) {
            return res
                .status(404)
                .json({ msg: "Usuário não encontrado.", ok: false });
        }
        //log
        yield log_model_1.default.create({
            user: req.currentUser._id,
            points: updatedUser.points,
            action: "acertou",
            question: req.params.idQuestion,
        });
        return res.status(200).json(updatedUser);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
//remove points
userRouter.get("/remove-points/:idQuestion", isAuth_1.default, attachCurrentUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.currentUser) {
            return res
                .status(401)
                .json({ msg: "Usuário não autenticado.", ok: false });
        }
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(req.currentUser._id, { $inc: { points: -1 } }, { new: true });
        if (!updatedUser) {
            return res
                .status(404)
                .json({ msg: "Usuário não encontrado.", ok: false });
        }
        //log
        yield log_model_1.default.create({
            user: req.currentUser._id,
            points: updatedUser.points,
            action: "acertou",
            question: req.params.idQuestion,
        });
        return res.status(200).json(updatedUser);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
//route to get all the questions the user answered correctly
userRouter.get("/questions/correct", isAuth_1.default, attachCurrentUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.currentUser) {
            return res
                .status(401)
                .json({ msg: "Usuário não autenticado.", ok: false });
        }
        const logs = yield log_model_1.default.find({
            $and: [{ user: req.currentUser._id }, { action: "acertou" }],
        });
        return res.status(200).json(logs);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
//route to get all the questions the user answered incorrectly
userRouter.get("/questions/incorrect", isAuth_1.default, attachCurrentUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.currentUser) {
            return res
                .status(401)
                .json({ msg: "Usuário não autenticado.", ok: false });
        }
        const logs = yield log_model_1.default.find({
            $and: [{ user: req.currentUser._id }, { action: "errou" }],
        });
        return res.status(200).json(logs);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
exports.default = userRouter;
