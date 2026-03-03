import mongoose from "mongoose";

const videoSchema = new mongoose.Schema( {
    title: {
      type: String,
      required: true
    },
    description: String,
    videoUrl: {
      type: String,
      required: true
    },
    thumbnailUrl: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

videoSchema.index({ title: "text", description: "text" }); //for text search
videoSchema.index({ createdAt: -1 }); //for sorting by creation date
videoSchema.index({ views: -1 }); //for sorting by view count
const Video = mongoose.model("Video", videoSchema);

export default Video;