import { userModel, validateUserModel } from "../models/user.model.js";
import userService from "../services/user.service.js";
import { hashPassword, comparePassword } from "../utils/hash-password.js";
import { createToken } from "../utils/jwt.js";
import redisClient from "../services/redis.service.js";

const createUserController = async (req, res) => {
  try {
    const { error } = validateUserModel(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.details.map((err) => err.message),
      });
    }

    const { email, password } = req.body;

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await userService.createUser({
      email,
      password: hashedPassword,
    });

    const token = await createToken({ id: newUser._id, email: newUser.email });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 60 * 60 * 1000, // 3 hours
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
      },
      token: token,
    });
  } catch (error) {
    console.error("Error in createUserController:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = await createToken({ id: user._id, email: user.email });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

const profileController = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

const logoutController = async (req, res) => {
  const token =
    req.cookies.authToken || req.headers.authorization?.split(" ")[1];
  redisClient.set(token, "logout", "EX", 4 * 60 * 60);
  res.status(200).json({
    success: true,
    message: "Logout Successfully",
  });
};

export default {
  createUserController,
  loginUserController,
  profileController,
  logoutController,
};
