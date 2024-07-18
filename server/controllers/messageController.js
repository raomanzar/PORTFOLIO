import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import Message from "../models/message-model.js";

const sendMessage = async (req, res, next) => {
  try {
    const { email, subject, message } = req.body;
    const response = await Message.create({
      email,
      subject,
      message,
    });

    if (response) {
      res
        .status(200)
        .json({ status: true, message: "Message sent successfully" });
    }
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const response = await Message.find();

    if (!response || response.length === 0) {
      return next(new ErrorHandler(404, null, "No data found"));
    } else {
      res.status(200).json({ status: true, Messages: response });
    }
  } catch (error) {
    next(error);
  }
};

const deleteMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await Message.deleteOne({ _id: id });
    if (response.deletedCount > 0) {
      res
        .status(200)
        .json({ status: true, message: "Message deleted successfully" });
    } else {
      res.status(404).json({
        status: false,
        message: "Message already deleted",
      });
    }
  } catch (error) {
    next(error);
  }
};

export { sendMessage, getMessages, deleteMessages };
