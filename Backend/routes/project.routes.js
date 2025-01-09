import { Router } from "express";
import projectController from '../controllers/project.controller.js'
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.post('/create',auth,(req,res)=>projectController.createProjectController(req,res));

router.get('/all',auth,(req,res)=>projectController.getAllProjectController(req,res))

router.put('/add-user',auth ,(req,res)=>projectController.addUserController(req,res));

router.get('/:projectId',auth,(req,res)=>projectController.getProjectByIdController(req,res));

export default router