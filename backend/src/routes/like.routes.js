import express from "express";

import {togglelike, getlikecount} from "../controllers/like.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:videoId/toggle", authMiddleware, togglelike);
router.get("/:videoId/count", getlikecount);

export default router;