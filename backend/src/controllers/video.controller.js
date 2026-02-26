import Video from "../models/video.model.js";

export const  uploadVideo = async (req,res)=>{
    try {
     const {title,description,videoUrl,thumbnailUrl}=req.body;

     if(!title || !videoUrl){
        return res.status(400).json({message:"Title and video URL are required"});
     }

     const video = await Video.create({
        title,
        description,
        videoUrl,
        thumbnailUrl,
        owner: req.user._id
     });

      return  res.status(201).json({message:"Video uploaded successfully", video});
    

    }catch (error) {
        res.status(500).json({ message: "Failed to upload video", error: error.message });
    }
}