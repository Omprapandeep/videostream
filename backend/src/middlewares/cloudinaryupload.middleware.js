import express from "express";
import multer from "multer";

import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";


const storage =  new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"videotube",
        resource_type:"video" ,//important for video upload
        allow_formats:["mp4","mov","avi","mkv"],
    }
})

const upload = multer({storage});

export default upload;