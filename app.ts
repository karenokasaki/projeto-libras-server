import cors from "cors";
import * as dotenv from "dotenv";
import express, { Express, Response, Request } from "express";
import { connectToDB } from "./config/db.config";
//rotas
import userRouter from "./routes/user.route";
import adminRouter from "./routes/admin.route";
import cloudinaryRouter from "./routes/cloudinary.route";
import questionRouter from "./routes/question.route";

const app: Express = express();

app.use(cors());
app.use(express.json());

dotenv.config();

//rotas
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/cloudinary", cloudinaryRouter);
app.use("/question", questionRouter);

//conectar com db primeiro depois subir o servidor
connectToDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
});
