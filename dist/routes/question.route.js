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
const question_model_1 = __importDefault(require("../models/question.model"));
const isAuth_1 = __importDefault(require("../middlewares/isAuth"));
const isAdmin_1 = require("../middlewares/isAdmin");
const attachCurrentUser_1 = __importDefault(require("../middlewares/attachCurrentUser"));
const user_model_1 = __importDefault(require("../models/user.model"));
const QuestionRouter = express_1.default.Router();
/* ONLY ADMIN */
// CREATE
QuestionRouter.post("/create", isAuth_1.default, attachCurrentUser_1.default, isAdmin_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.currentUser) {
            return res.status(401).json({ msg: "Não autorizado" });
        }
        // cria a pergunta
        const question = yield question_model_1.default.create(Object.assign({ createdBy: req.currentUser._id }, req.body));
        // faz o push da pergunta criada para a array de perguntas do admin
        const userAdmin = yield user_model_1.default.findById(req.currentUser._id);
        if (!userAdmin) {
            return res.status(404).json({ msg: "Admin não encontrado" });
        }
        userAdmin.questions.push(question._id);
        yield userAdmin.save();
        return res.status(201).json(question);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
// UPDATE
QuestionRouter.put("/:id", isAuth_1.default, attachCurrentUser_1.default, isAdmin_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const question = yield question_model_1.default.findByIdAndUpdate(req.params.id, Object.assign({}, req.body), {
            new: true,
            runValidators: true,
        });
        if (!question) {
            return res.status(404).json({ msg: "Pergunta não encontrada" });
        }
        return res.status(200).json(question);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
// DELETE
QuestionRouter.delete("/:id", isAuth_1.default, attachCurrentUser_1.default, isAdmin_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const question = yield question_model_1.default.findByIdAndDelete(req.params.id);
        if (!question) {
            return res.status(404).json({ msg: "Pergunta não encontrada" });
        }
        return res.status(204).json();
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
/* USERS */
// READ ALL
QuestionRouter.get("/get-all", isAuth_1.default, attachCurrentUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield question_model_1.default.find();
        return res.status(200).json(questions);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
// READ ONE
QuestionRouter.get("/:id", isAuth_1.default, attachCurrentUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const question = yield question_model_1.default.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ msg: "Pergunta não encontrada" });
        }
        return res.status(200).json(question);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
// GET BY LEVEL
QuestionRouter.get("/get-by-level/:level", isAuth_1.default, attachCurrentUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield question_model_1.default.find({ level: req.params.level });
        if (!questions) {
            return res.status(404).json({ msg: "Perguntas não encontradas" });
        }
        return res.status(200).json(questions);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}));
exports.default = QuestionRouter;
