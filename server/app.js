import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

// middleware import
import errorMiddleware from "./middlewares/errorMiddleware.js";

//routers
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";

// middlewares
dotenv.config({ path: "./config/config.env" });
app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/public/",
  })
);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use(errorMiddleware);

export default app;
