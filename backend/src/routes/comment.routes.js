import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import {addcomment, getcomments} from '../controllers/comment.controller.js'

const router = express.Router();

router.post("/:videoId/add", authMiddleware, addcomment);
router.get("/:videoId/get",  getcomments);

export default router;