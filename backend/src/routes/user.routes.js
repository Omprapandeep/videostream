import express from 'express';
import {registerUser,loginUser,getprofile,updateProfile} from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",authMiddleware,getprofile);
router.put("/profile",authMiddleware,updateProfile);

export default router;