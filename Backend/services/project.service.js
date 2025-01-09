import { projectModel } from '../models/project.model.js';
import mongoose from 'mongoose';

const findProjectByName = async (name) => {
  return await projectModel.findOne({ name });
};

const findProjectById = async ({ projectId }) => {
  try {
    if (!mongoose.isValidObjectId(projectId)) {
      throw new Error("Invalid project ID");
    }

    const project = await projectModel.findById(projectId).populate('users');

    if (!project) {
      throw new Error("Project not found");
    }
    return project;
  } catch (error) {
    console.error("Error finding project by ID:", error.message);
    throw new Error("Failed to find project by ID");
  }
};

const createProject = async (name, userId) => {
  try {
    const existingProject = await findProjectByName(name);
    if (existingProject) {
      return { success: false, message: 'Project with this name already exists.' };
    }

    const project = await projectModel.create({ name, users: [userId] });

    return { success: true, project };
  } catch (error) {
    return { success: false, message: 'An error occurred while creating the project.', error };
  }
};

const getAllProjectByUserId = async ({ userId }) => {
  try {
    if (!userId) {
      throw new Error("User Id is required");
    }
    const allUserProjects = await projectModel.find({ users: userId });

    if (!allUserProjects || allUserProjects.length === 0) {
      return [];
    }

    return allUserProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("An error occurred while fetching projects");
  }
};


export const addUsersToProject = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error("projectId is required")
}

if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId")
}

if (!users) {
    throw new Error("users are required")
}

if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
    throw new Error("Invalid userId(s) in users array")
}

if (!userId) {
    throw new Error("userId is required")
}

if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId")
}


const project = await projectModel.findOne({
    _id: projectId,
    users: userId
})

if (!project) {
    throw new Error("User not belong to this project")
}

const updatedProject = await projectModel.findOneAndUpdate({
    _id: projectId
}, {
    $addToSet: {
        users: {
            $each: users
        }
    }
}, {
    new: true
})

return updatedProject
}

export default { findProjectByName, createProject,getAllProjectByUserId,addUsersToProject,findProjectById };
