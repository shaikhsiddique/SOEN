import { Router } from "express";
const router = Router();
import userController  from '../controllers/user.controller.js';
import auth from "../middleware/auth.middleware.js";



router.get('/',auth,(req,res)=>{
userController.profileController(req,res);
})

router.post("/register",(req,res)=>{
userController.createUserController(req,res);
})

router.post("/login",(req,res)=>{
userController.loginUserController(req,res);
})

router.get('/logout',(req,res)=>{
userController.logoutController(req,res);  
})

router.get('/all',auth,(req,res)=>{
    userController.getAllUserController(req,res);
})

export default router