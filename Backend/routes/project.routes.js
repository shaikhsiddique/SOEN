import { Router } from "express";
import projectController from '../controllers/project.controller.js'
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.post('/create',auth,(req,res)=>projectController.createProjectController(req,res));

export default router