import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email Required"],
    minlength: [5, "Email must be at least 5 characters long"],
    maxlength: [50, "Email must be at most 50 characters long"],
    match: [/^\S+@\S+\.\S+$/, "Please fill a valid email address"],
  },
  subject: {
    type: String,
    required: [true, "Subject Required"],
    minlength: [5, "Subject must be at least 5 characters long"],
    maxlength: [100, "Subject must be at most 100 characters long"],
  },
  message: {
    type: String,
    required: [true, "Message Required"],
    minlength: [10, "Message must be at least 10 characters long"],
    maxlength: [500, "Message must be at most 500 characters long"],
  },
});

const Message = new mongoose.model("Message", messageSchema);

export default Message;
