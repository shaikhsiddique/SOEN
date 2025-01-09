import { projectModel, validateProjectModel } from "../models/project.model.js";
import projectService from "../services/project.service.js";

const createProjectController = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    const { error } = validateProjectModel({ name, userId });
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

const getAllProjectController = async (req, res) => {
  let userId = req.user.id;

  try {
    const allUserProjects = await projectService.getAllProjectByUserId({
      userId,
    });

    if (!allUserProjects || allUserProjects.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for this user." });
    }

    return res.status(200).json(allUserProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching projects" });
  }
};

const addUserController = async (req, res) => {
  try {
    const { projectId, users } = req.body;
    const loggedInUser = req.user;

    const project = await projectService.addUsersToProject({
      projectId,
      users,
      userId: loggedInUser.id,
    });

    return res.status(200).json({
      project,
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message })
  }
};

const getProjectByIdController = async (req,res) => {
  try {
    const projectId = req.params.projectId;
    const project = await projectService.findProjectById({projectId});
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    return res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return res.status(500).json({ message: "An error occurred while fetching project by ID" });
  }
}

export default {
  createProjectController,
  getAllProjectController,
  addUserController,
  getProjectByIdController
};
