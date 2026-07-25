import Video from "../models/video.model.js";
import Like from "../models/likes.model.js";
import Comment from "../models/comment.model.js";
import cloudinary from "../config/cloudinary.js";
import Subscription from "../models/subscription.model.js";

export const uploadVideo = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !req.file) {
            return res.status(400).json({ message: "Title and video file are required" });
        }

        const videourl = req.file.path; // Assuming you're using Cloudinary and want to store the uploaded file's path

        //extract public_id from cloudinary  
        const publicId = req.file.filename // Extract public_id from the video URL

        // Generate thumbnail URL with quality and format optimizations
        const thumbnailUrl = cloudinary.url(publicId, {
            resource_type: "video",
            format: "jpg",
            transformation: [
                { width: 480, height: 360, crop: "fill", quality: "auto", fetch_format: "auto" }
            ]
        });

        const video = await Video.create({
            title,
            description,
            videoUrl: req.file.path, // Assuming you're using Cloudinary and want to store the uploaded file's path
            thumbnailUrl: thumbnailUrl,
            publicId: publicId,
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
        const limit = parseInt(req.query.limit) || 12;
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

        // batch fetch likes and comments counts in parallel
        const videoIds = videos.map(v => v._id);
        const [likeCounts, commentCounts] = await Promise.all([
            Like.aggregate([
                { $match: { video: { $in: videoIds } } },
                { $group: { _id: "$video", count: { $sum: 1 } } }
            ]),
            Comment.aggregate([
                { $match: { video: { $in: videoIds } } },
                { $group: { _id: "$video", count: { $sum: 1 } } }
            ])
        ]);

        const likeMap = Object.fromEntries(likeCounts.map(l => [l._id.toString(), l.count]));
        const commentMap = Object.fromEntries(commentCounts.map(c => [c._id.toString(), c.count]));

        const videosWithcounts = videos.map(video => ({
            ...video,
            likes: likeMap[video._id.toString()] || 0,
            comments: commentMap[video._id.toString()] || 0
        }));

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

        // 🔥 check query param
        const shouldIncrement = req.query.increment === "true";

        let query;

        if (shouldIncrement) {
            query = Video.findByIdAndUpdate(
                videoId,
                { $inc: { views: 1 } },
                { returnDocument:'after' }
            );
        } else {
            query = Video.findById(videoId);
        }

        const video = await query
            .populate("owner", "username")
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
};

export const deletevideo = async (req, res) => {
    try {
        const videoid = req.params.videoId;

        const video = await Video.findById(videoid);


        if (!video) {
            return res.status(404).json({ message: "video not found" });

        }

        //check ownership

        if (video.owner.toString() != req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to delete this video",
                error: err.message
            });
        }

        //delete from cloudinary

        await cloudinary.uploader.destroy(video.publicId, {
            resource_type: "video"
        })

        //delete likes comment 
        await Like.deleteMany({ video: videoid });
        await Comment.deleteMany({ video: videoid });

        // delete video document
        await Video.findByIdAndDelete(videoid);


        res.json({ message: "Video deleted successfully" });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete video",
            error: err.message
        });
    }
}

export const getMyVideos = async (req, res) => {
    try {

        const userId = req.user._id;

        const videos = await Video.find({ owner: userId })
            .select("title description thumbnailUrl views createdAt")
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            message: "User videos fetched",
            totalVideos: videos.length,
            videos
        });

    } catch (err) {
        res.status(500).json({
            message: "Failed to get user videos",
            error: err.message
        });
    }
};

//update video

export const updatevideo = async (req, res) => {
    try {
        const { title, description } = req.body;


        const video = await Video.findById(req.params.videoId);
        if (!video) {
            return res.status(404).json({ message: "video not found" });
        }

        //owner check
        if (video.owner.toString() != req.user.id) {
            return res.status(403).json({ message: "unauthorized" })
        }

        //update
        if (title) video.title = title;
        if (description) video.description = description;

        const updatevideo = await video.save();
        res.json(updatevideo);

    } catch (err) {
        res.status(500).json({
            message: "failed to update video",
            error: err.message
        }
        )
    }
}

//get the channel videos
export const getchannelvideos = async(req,res)=>{
    try{
        const userId = req.params.userId;

        const videos = await Video.find({owner:userId})
        .select("title description thumbnailUrl views likes createdAt")
        .populate("owner","username")
        .sort({createdAt:-1})
        .lean();  //lean for better performance since we are only reading data and not using mongoose document methods

        res.json({
            videos,
            totalVideos: videos.length
        })
    }catch(err){
        res.status(500).json({message:"failed to get channel videos",error:err.message})
    }
};

export const getsubscribedvideos = async(req,res)=>{
    try{
      const userId= req.user._id;
      
      //add pagination 
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const search = req.query.search || "";
      const skip = (page-1)*limit;

      //get subscribed channels
      const subs = await Subscription.find({subscriber:userId}).select("channel");
      const channelIds = subs.map(sub=>sub.channel);
     
       //search filter
       const searchFilter = {
        owner:{$in:channelIds},  //only videos from subscribed channels
        $or:[
            {title:{$regex:search,$options:"i"}},
            {description:{$regex:search,$options:"i"}}
        ]
       };
       
        //total count (for pagination)
        const totalvideos = await Video.countDocuments(searchFilter);

        //fetch paginated videos
        const videos = await Video.find(searchFilter)
        .select("title description thumbnailUrl views createdAt owner") //only select required fields for better performance
        .populate("owner","username")
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .lean();  //lean for better performance since we are only reading data and not using mongoose document methods
       
        // batch fetch likes and comments counts in parallel
        const videoIds = videos.map(v => v._id);
        const [likeCounts, commentCounts] = await Promise.all([
            Like.aggregate([
                { $match: { video: { $in: videoIds } } },
                { $group: { _id: "$video", count: { $sum: 1 } } }
            ]),
            Comment.aggregate([
                { $match: { video: { $in: videoIds } } },
                { $group: { _id: "$video", count: { $sum: 1 } } }
            ])
        ]);

        const likeMap = Object.fromEntries(likeCounts.map(l => [l._id.toString(), l.count]));
        const commentMap = Object.fromEntries(commentCounts.map(c => [c._id.toString(), c.count]));

        const videosWithcounts = videos.map(video => ({
            ...video,
            likes: likeMap[video._id.toString()] || 0,
            comments: commentMap[video._id.toString()] || 0
        }));
        
        const totalPages = Math.ceil(totalvideos/limit);




        res.status(200).json({
            message:"Subscribed videos fetched",
            currentPage:page,
            totalPages,
            totalVideos:totalvideos,
            videos:videosWithcounts
        });

    }catch(err){
        res.status(500).json({message:"failed to get subscribed videos",error:err.message})
    }
};

