import express from "express";
import { uploadVideo,getAllvideos,getsinglevideo,deletevideo,getMyVideos,updatevideo, getchannelvideos , getsubscribedvideos } from "../controllers/video.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/cloudinaryupload.middleware.js";


const router = express.Router();

router.post("/upload", authMiddleware, upload.single("video"), uploadVideo);  // "video" is the field name in the form-data for the video file
router.get("/all", getAllvideos);

router.get("/myvideos",authMiddleware,getMyVideos);

router.put("/:videoId",authMiddleware,updatevideo);

router.get("/channel/:userId",getchannelvideos);

router.get("/feed/subscribed",authMiddleware,getsubscribedvideos);

router.delete("/:videoId",authMiddleware,deletevideo);

router.get("/:videoId",getsinglevideo);
export default router;

//Express reads top → bottom