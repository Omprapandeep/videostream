import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const VideoPage = () => {

  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    fetchVideo();
    fetchRecommended();
  }, []);

  const fetchVideo = async () => {
    try {
      const res = await api.get(`/videos/${id}`);
      setVideo(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // fetch other videos
  const fetchRecommended = async () => {
    try {
      const res = await api.get("/videos/all");
      setRecommended(res.data.videos);
    } catch (err) {
      console.log(err);
    }
  };

  if (!video)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading video...
      </div>
    );

  return (

    <div className="w-full pt-2 bg-[oklch(0.56_0.08_317.97)] px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-3 gap-6 ">

      {/* LEFT SIDE - VIDEO */}
      <div className="lg:col-span-2">

        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
          <video
            src={video.videoUrl}
            controls
            className="w-full h-full object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold mt-4">
          {video.title}
        </h1>

        {/* Owner + Like */}
        <div className="flex items-center justify-between mt-4">

          {/* Channel */}
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold">
              {video.owner?.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-medium">{video.owner?.username}</p>
              <p className="text-sm text-black">
                {video.views} views
              </p>
            </div>

          </div>

          {/* Like */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">
            ❤️ {video.likes || 0}
          </button>

        </div>

        {/* Description */}
        {video.description && (
          <div className="mt-5 bg-gray-100 p-4 rounded-lg text-sm">
            {video.description}
          </div>
        )}

        {/* Comments */}
        <div className="mt-8">

          <h2 className="text-lg font-semibold mb-4">
            Comments
          </h2>

          <input
            type="text"
            placeholder="Write a comment..."
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring"
          />

        </div>

      </div>


      {/* RIGHT SIDE - RECOMMENDED VIDEOS */}
      <div className="space-y-4">
         {console.log(recommended)}
        {recommended.map((vid) => (

          <div
            key={vid._id}
            className="flex gap-3 bg-black cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
          >

            <img
              src={vid.thumbnailUrl}
              className="w-40 h-24 object-cover rounded-lg"
            />

            <div className="text-sm">
              <p className="font-medium line-clamp-2">
                {vid.title}
              </p>

              <p className="text-gray-500 text-xs">
                {vid.owner?.username}
              </p>

              <p className="text-gray-500 text-xs">
                {vid.views} views
              </p>
            </div>

          </div>

        ))}

      </div>

    </div>

  );
};

export default VideoPage;