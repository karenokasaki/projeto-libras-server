require("dotenv").config();
import cors from "cors";
import express, { Express, Response, Request } from "express";
import { connectToDB } from "./config/db.config";
//rotas
import userRouter from "./routes/user.route";
import cloudinaryRouter from "./routes/cloudinary.route";
import questionRouter from "./routes/question.route";

const app: Express = express();

app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json());

//teste
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

//rotas
app.use("/user", userRouter);
app.use("/cloudinary", cloudinaryRouter);
app.use("/question", questionRouter);

console.log("testing");

//conectar com db primeiro depois subir o servidor
connectToDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
});
