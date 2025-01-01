import { projectModel } from '../models/project.model.js';

const findProjectByName = async (name) => {
  return await projectModel.findOne({ name });
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

export default { findProjectByName, createProject };
