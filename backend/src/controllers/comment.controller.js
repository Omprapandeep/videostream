import Comment from "../models/comment.model.js";

export const addcomment = async (req,res)=>{
    try{
       const {content} = req.body;
       const videoId = req.params.videoId;

       if(!content){
        return res.status(400).json({message:"content is required"})
       }
       const comment= await Comment.create({
        content,
        video:videoId,
        owner:req.user._id
       })

       res.status(201).json({message:"comment added successfully",comment})
    }
    catch(err){
        res.status(500).json({message:"faild to add comment",error:err.message})
    }
}

export const getcomments = async (req,res)=>{
    try{
       const videoId = req.params.videoId;

       const comments= (await Comment.find({video:videoId}).populate("owner","username")).toSorted({createdAt:-1})
       
       res.status(200).json({message:"comments fetched successfully",comments})
    }catch(err){
        res.status(500).json({message:"failed to get comment",error:err.message})
    }
}