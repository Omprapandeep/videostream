import express from "express";
import { uploadVideo } from "../controllers/video.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/upload", authMiddleware, uploadVideo);

export default router;