"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const db_config_1 = require("./config/db.config");
//rotas
const user_route_1 = __importDefault(require("./routes/user.route"));
const cloudinary_route_1 = __importDefault(require("./routes/cloudinary.route"));
const question_route_1 = __importDefault(require("./routes/question.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
    origin: "*",
}));
app.use(express_1.default.json());
//teste
app.get("/", (req, res) => {
    res.send("Hello World!");
});
//rotas
app.use("/user", user_route_1.default);
app.use("/cloudinary", cloudinary_route_1.default);
app.use("/question", question_route_1.default);
console.log("testing");
//conectar com db primeiro depois subir o servidor
(0, db_config_1.connectToDB)().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is listening on port ${process.env.PORT}`);
    });
});
