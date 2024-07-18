import mongoose from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: [true, "First name is required"] },
  lastname: { type: String },
  surname: { type: String },
  email: {
    type: String,
    required: [true, "Email is required"],
    minlength: [8, "Password should contain 8 characters"],
    match: [/^\S+@\S+\.\S+$/, "Please fill a valid email address"],
  },
  about: { type: String, required: [true, "About is required"] },
  phone: {
    type: String,
    required: [true, "Phone is required"],
    minlength: [11, "Phone number must be 11 digits"],
    maxlength: [11, "Phone number must be 11 digits"],
    match: [/^\d{11}$/, "Phone number must contain exactly 11 digits"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [5, "Password must contain at least 8 characters"],
    select: false,
    // match: [
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //   "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    // ],
  },
  avatar: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  resume: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  profileLink: String,
  githubUrl: String,
  facebookUrl: String,
  instagramUrl: String,
  linkedinUrl: String,
  twitterUrl: String,
  forgotPasswordToken: String,
  forgotPasswordTokenExpired: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

userSchema.methods.generateToken = function () {
  return JWT.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_DATE,
  });
};

userSchema.methods.getForgotPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.forgotPasswordTokenExpired = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
