import Like from "../models/likes.model.js";
export const togglelike = async (req,res)=>{
    try{
        const userID=req.user._id;
        const videoID=req.params.videoId;

        //check if like already exists
        const existingLike = await Like.findOne({user:userID, video:videoID});

        if(existingLike){
            await Like.deleteOne({_id:existingLike._id});
            return res.json({message:"Video unliked"});
        }
        await Like.create({user:userID, video:videoID});
        res.json({message:"Video liked"});

    }catch(error) {
        res.status(500).json({message:"Error toggling like", error});
    }
}


export const getlikecount = async (req,res)=>{
    try{
        const videoId=req.params.videoId;
        const likecount = await Like.countDocuments(
            {
                video:videoId
            } );
        res.json({
            likes:likecount
        })

    }catch(err){
        res.status(500).json({message:"error fetching like count", error:err});
    }
}