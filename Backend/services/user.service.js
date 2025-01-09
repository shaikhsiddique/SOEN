import { userModel } from "../models/user.model.js";

const createUser = async ({ email, password }) => {
  try {
    // Check if email and password are provided
    if (!email || !password) {
      throw new Error("Email and Password are required.");
    }

    // Create a new user
    const user = await userModel.create({ email, password });
    return user;
  } catch (error) {
    // Log the error and rethrow it
    console.error("Error creating user:", error.message);
    throw new Error(
      error.message || "An error occurred while creating the user."
    );
  }
};

const findUserByEmail = async (email) => {
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      return user; // Return the found user
    }
    return null; // Return null if no user is found
  } catch (error) {
    console.error("Error finding user by email:", error.message);
    throw new Error("Database query failed");
  }
};

const getAllUser = async ({ userId }) => {
  try {
    const users = await userModel.find({
      _id: { $ne: userId },
    });
    return users;
  } catch (error) {
    
    console.error("Error fetching users:", error.message);
    throw new Error("Failed to fetch users");
  }
};

export default { createUser, findUserByEmail , getAllUser };
