import { v2 as cloudinary } from "cloudinary";
import User from "../models/user-model.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import sendEmail from "../helpers/sendEmail.js";
import crypto from "crypto";

const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({ message: "User already exist" });
    } else {
      if (!req.files || Object.keys(req.files).length !== 2) {
        return res.status(400).json({
          message: `Avatar or Resume is not provided`,
        });
      } else {
        const { avatar, resume } = req.files;
        const [cloudinaryAvatarResponse, cloudinaryResumeResponse] =
          await Promise.all([
            cloudinary.uploader.upload(avatar.tempFilePath, {
              folder: "Avatars",
            }),
            cloudinary.uploader.upload(resume.tempFilePath, {
              folder: "Resumes",
            }),
          ]);
        if (
          !cloudinaryAvatarResponse ||
          !cloudinaryResumeResponse ||
          cloudinaryAvatarResponse.error ||
          cloudinaryResumeResponse.error
        ) {
          next(new ErrorHandler(500, "", "Cloudinary upload error"));
        }
        const response = await User.create({
          ...req.body,
          avatar: {
            public_id: cloudinaryAvatarResponse.public_id,
            url: cloudinaryAvatarResponse.url,
          },
          resume: {
            public_id: cloudinaryResumeResponse.public_id,
            url: cloudinaryResumeResponse.url,
          },
        });
        const user = response.toObject();
        delete user.password;
        if (response) {
          res.status(201).json({
            status: true,
            message: "Registration successfull",
            user: user,
          });
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return next(new ErrorHandler(400, "Field Missing", "Email is required."));
    }

    if (!password) {
      return next(
        new ErrorHandler(400, "Field Missing", "Password is required.")
      );
    }

    const userExist = await User.findOne({ email }).select("+password");
    if (!userExist) {
      return next(new ErrorHandler(404, null, "Invalid Credentials"));
    } else {
      const verifyPass = await userExist.comparePassword(password);
      if (!verifyPass) {
        res.status(403).json({ message: "Invalid Credentials" });
      } else {
        const user = userExist.toObject();
        delete user.password;
        const token = userExist.generateToken();
        res
          .status(201)
          .cookie("token", token, {
            expire: new Date(
              Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          })
          .json({
            status: true,
            message: "Login successfull",
            user,
            token: token,
          });
      }
    }
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const data = await User.findById({ _id });
    if (!data) {
      return next(new ErrorHandler(400, "", "No Data Found"));
    } else {
      res.status(200).json({ status: true, data });
    }
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updatedData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      surname: req.body.surname,
      email: req.body.email,
      about: req.body.about,
      phone: req.body.phone,
      profileLink: req.profileLink,
      githubUrl: req.body.githubUrl,
      facebookUrl: req.body.facebookUrl,
      instagramUrl: req.body.instagramUrl,
      linkedinUrl: req.body.linkedinUrl,
      twitterUrl: req.body.twitterUrl,
    };

    if (req.files) {
      const user = await User.findById(req.user._id.toString());

      if (req.files.avatar) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
        const response = await cloudinary.uploader.upload(
          req.files.avatar.tempFilePath,
          { folder: "Avatars" }
        );
        if (!response || !response) {
          next(new ErrorHandler(500, "", "Cloudinary upload error"));
        } else {
          updatedData.avatar = {
            public_id: response.public_id,
            url: response.url,
          };
        }
      }
      if (req.files.resume) {
        await cloudinary.uploader.destroy(user.resume.public_id);
        const response = await cloudinary.uploader.upload(
          req.files.resume.tempFilePath,
          { folder: "Resumes" }
        );
        if (!response || !response) {
          next(new ErrorHandler(500, "", "Cloudinary upload error"));
        } else {
          updatedData.resume = {
            public_id: response.public_id,
            url: response.url,
          };
        }
      }
    }

    const response = await User.updateOne(
      { _id: req.user._id.toString() },
      {
        $set: { ...updatedData },
      }
    );
    console.log(response);
    if (
      !response ||
      response.acknowledged === false ||
      response.modifiedCount === 0
    ) {
      return next(new ErrorHandler(400, "", "User Not Modified"));
    } else {
      res.status(201).json({
        status: true,
        message: "Profile Updated",
        updatedData: response,
      });
    }
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return next(new ErrorHandler(400, "", "Please fill all the fields"));
    } else {
      const user = await User.findById(req.user._id).select("+password");
      const passwordMatched = await user.comparePassword(currentPassword);
      if (!passwordMatched) {
        return next(new ErrorHandler(400, "", "Current pasword not matched"));
      } else {
        if (newPassword !== confirmNewPassword) {
          return next(
            new ErrorHandler(
              400,
              "",
              "New and Confirm Password are not matched"
            )
          );
        } else {
          user.password = newPassword;
          const response = await user.save();
          if (!response) {
            return next(new ErrorHandler(400, "", "Password not updated"));
          } else {
            res.status(201).json({
              status: true,
              message: "Password updated",
              userId: response._id,
            });
          }
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", "", { expire: new Date(Date.now()), httpOnly: true })
      .json({ status: true, message: "Logged out" });
  } catch (error) {
    next(error);
  }
};

const getUserPortfolioData = async (req, res, next) => {
  try {
    const response = await User.findOne().select("-password");
    res.status(200).json({ status: true, user: response });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    if (!req.body.email) {
      return next(new ErrorHandler(400, "Field Missing", "Email is required."));
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorHandler(404, "", "User Not Found"));
    }

    const forgotPasswordToken = user.getForgotPasswordToken();
    await user.save({ validateBeforeSave: false });
    const forgotPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${forgotPasswordToken}`;
    const emailMessage = `Your forgot password url is \n\n${forgotPasswordUrl}\n\nThis link will expire in 10 minutes\n\nIgnore this message if you have not requested this. `;

    const emailResponse = await sendEmail({
      email: user.email,
      subject: "Personal Prtfolio Dashboard Recovery Password",
      message: emailMessage,
    });

    if (emailResponse) {
      res.status(200).json({
        status: true,
        message: `Email sent to this email: ${user.email}`,
      });
    } else {
      user.forgotPasswordToken = undefined;
      user.forgotPasswordTokenExpired = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler(500, "", "Error in Sending Email"));
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    if (!req.body.password || !req.body.confirmPassword) {
      return next(
        new ErrorHandler(
          400,
          "",
          "Password and ConfirmPassword field should not be empty"
        )
      );
    }
    const { token } = req.params;
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      forgotPasswordToken: resetPasswordToken,
      forgotPasswordTokenExpired: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrorHandler(
          400,
          "",
          "Reset Password token has been Expired or Invalid"
        )
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(
        new ErrorHandler(400, "", "Password and Confirm Password doesn't match")
      );
    }
    user.password = req.body.password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpired = undefined;
    let response = await user.save();
    if (response) {
      res
        .status(200)
        .json({ status: true, message: "Password reset successfully" });
    }
  } catch (error) {
    next(error);
  }
};

export {
  register,
  login,
  logout,
  getUser,
  updateUser,
  updatePassword,
  getUserPortfolioData,
  forgotPassword,
  resetPassword,
};
