import express from "express";
const messageRouter = express.Router();
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  sendMessage,
  getMessages,
  deleteMessages,
} from "../controllers/messageController.js";

messageRouter.route("/send").post(sendMessage);
messageRouter.route("/get").get(authMiddleware, getMessages);
messageRouter.route("/delete/:id").delete(authMiddleware, deleteMessages);

export default messageRouter;
