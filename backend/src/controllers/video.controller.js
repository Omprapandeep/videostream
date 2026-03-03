import Video from "../models/video.model.js";
import Like from "../models/likes.model.js";
import Comment from "../models/comment.model.js";
import cloudinary from "../config/cloudinary.js";

export const uploadVideo = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !req.file) {
            return res.status(400).json({ message: "Title and video file are required" });
        }

        const videourl = req.file.path; // Assuming you're using Cloudinary and want to store the uploaded file's path

        //extract public_id from cloudinary  
        const publicId = req.file.filename // Extract public_id from the video URL

        // Generate thumbnail URL
        const thumbnailUrl = cloudinary.url(publicId, {
            resource_type: "video",
            format: "jpg",
            transformation: [
                { width: 480, height: 360, crop: "fill" }
            ]
        });

        const video = await Video.create({
            title,
            description,
            videoUrl: req.file.path, // Assuming you're using Cloudinary and want to store the uploaded file's path
            thumbnailUrl: thumbnailUrl,
            owner: req.user._id
        });

        return res.status(201).json({ message: "Video uploaded successfully", video });


    } catch (error) {
        res.status(500).json({ message: "Failed to upload video", error: error.message });
    }
}

//get all videos
export const getAllvideos = async (req, res) => {
    try {

        //get page & limit from query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        //search filter

        const searchFilter = {
            $or: [
                { title: { $regex: search, $options: "i" } },        //options i for case insensetive search
                { description: { $regex: search, $options: "i" } }
            ]
        }

        //total count (for pagination)
        const totalvideos = await Video.countDocuments(searchFilter);

        //fetch paginated videos

        const videos = await Video.find(searchFilter)
            .select("title description videoUrl thumbnailUrl views createdAt owner") //only select required fields for better performance
            .populate("owner", "username")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(); //lean for better performance since we are only reading data and not using mongoose document methods   

        //addlikes and comments
        const videosWithcounts = await Promise.all(
            videos.map(async (video) => {
                const likecount = await Like.countDocuments({ video: video._id });
                const commentcount = await Comment.countDocuments({ video: video._id });

                return {
                    ...video,
                    likes: likecount,
                    comments: commentcount
                };

            })
        )

        const totalPages = Math.ceil(totalvideos / limit);

        //send response

        return res.status(200).json({
            message: "Videos fetched successfully",
            currentpage: page,
            totalPages,
            totalvideos,
            videos: videosWithcounts
        });

    } catch (err) {
        res.status(500).json({ message: "failed to get videos", error: err.message })
    }
}

//get single video+increment views

export const getsinglevideo = async (req, res) => {
    try {
        const videoId = req.params.videoId;

        const video = await Video.findByIdAndUpdate(
            videoId,
            { $inc: { views: 1 } },
            { returnDocument: "after" }
        ).populate("owner", "username")
            .select("title description videoUrl thumbnailUrl views createdAt owner")
            .lean();

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        const likeCount = await Like.countDocuments({ video: videoId });
        const commentCount = await Comment.countDocuments({ video: videoId });

        return res.status(200).json({
            ...video,
            likes: likeCount,
            comments: commentCount
        });



    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}