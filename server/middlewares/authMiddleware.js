import JWT from "jsonwebtoken";
import User from "../models/user-model.js";
import { ErrorHandler } from "./errorMiddleware.js";

const authMiddleware = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token || token.length === 0) {
    return next(
      new ErrorHandler(400, "Authentication Error", "Token not provided")
    );
  } else {
    const verify = JWT.verify(token, process.env.JWT_SECRET_KEY);
    if (!verify) {
      return next(
        new ErrorHandler(400, "Authentication Error", "User not authenticated")
      );
    } else {
      const user = await User.findById({ _id: verify.id });
      user
        ? (req.user = user)
        : next(
            new ErrorHandler(
              400,
              "Authentication Error",
              "Authneticate user not found"
            )
          );
      next();
    }
  }
};

export default authMiddleware;
