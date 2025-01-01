import { projectModel, validateProjectModel } from '../models/project.model.js';
import projectService from '../services/project.service.js';

const createProjectController = async (req, res) => {
  console.log(req.body);
  
  try {
    const { name, userId } = req.body;
    const { error } = validateProjectModel(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.details.map((err) => err.message),
      });
    }


    const existingProject = await projectService.findProjectByName(name);
    if (existingProject) {
      return res.status(409).json({
        success: false,
        message: "Project with this name already exists",
      });
    }

    const newProject = await projectService.createProject(name, userId);

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error in createProjectController:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export default { createProjectController };
