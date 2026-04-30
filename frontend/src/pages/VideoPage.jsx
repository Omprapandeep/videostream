import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 }
  ];

  for (let i = 0; i < intervals.length; i++) {
    const interval = Math.floor(seconds / intervals[i].seconds);
    if (interval >= 1) {
      return interval + " " + intervals[i].label + (interval > 1 ? "s" : "") + " ago";
    }
  }

  return "Just now";
};

const VideoPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);

  const [comments, setcomments] = useState([]);
  const [commenttext, setcommenttext] = useState("");

  const [likes, setlikes] = useState(0);
  const [subscribed, setsubscribed] = useState(false);
  const [subcount, setsubcount] = useState(0);
  const [subloading, setsubloading] = useState(false);

  useEffect(() => {
    fetchVideo();
    fetchRecommended();
    fetchcomments();
    fetchlikes();
  }, [id]);

  useEffect(() => {
    if (video?.owner?._id) {
      fetchsubscription();
    }
  }, [video]);

  //comment fetch .

  const fetchcomments = async () => {
    try {
      const res = await api.get(`/comments/${id}/get`);
      setcomments(res.data.comments);

    } catch (err) {
      console.log(err);
    }
  }

  //fetch single video

  const fetchVideo = async () => {
    try {
      const viewedKey = `viewed_${id}`;
      const alreadyViewed = sessionStorage.getItem(viewedKey);

      const res = await api.get(
        `/videos/${id}?increment=${!alreadyViewed}`
      );

      setVideo(res.data);

      // mark as viewed
      if (!alreadyViewed) {
        sessionStorage.setItem(viewedKey, "true");
      }
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


  //fetch likes

  const fetchlikes = async () => {
    try {
      const res = await api.get(`/likes/${id}/count`);
      setlikes(res.data.likes);
    } catch (err) {
      console.log(err);
    }
  }

  //fetch subscribe status and count

  const fetchsubscription = async () => {
    try {
      if (!video?.owner?._id) return;
      //
      const videownerId = video.owner._id;
      //getcount 
      const res1 = await api.get(`/subscriptions/subscribers/${videownerId}`);
      console.log(res1.data);
      setsubcount(res1.data.subscribers);

      //get status 
      const token = localStorage.getItem("token");
      if (token) {
        const res2 = await api.get(`/subscriptions/${videownerId}/status`);
        console.log(res2.data);
        setsubscribed(res2.data.subscribed);
      }

    } catch (err) {
      console.log("Failed to fetch subscription status", err);
    }
  };


  //handle  add comments 

  const handleaddcomments = async () => {

    const token = localStorage.getItem("token");

    // If user not logged in → redirect
    if (!token) {
      navigate("/login");
      return;
    }

    if (!commenttext.trim()) return;

    try {
      await api.post(`/comments/${id}/add`, {
        content: commenttext
      });

      setcommenttext("");

      fetchcomments();

    } catch (err) {
      console.log(err);
    }
  }


  //like handle
  const handlelike = async () => {

    const token = localStorage.getItem("token");

    // If user not logged in → redirect
    if (!token) {
      navigate("/login");
      return;
    }


    try {

      const res = await api.post(`/likes/${id}/toggle`);

      // refresh like count
      fetchlikes();

    } catch (err) {
      console.log(err);
    }
  }

  const handlesubscribe = async () => {
    const token = localStorage.getItem("token");
    // If user not logged in → redirect
    if (!token) {
      navigate("/login");
      return;
    }

    if (subloading) return;

    try {
      setsubloading(true);

      const res = await api.post(`/subscriptions/${video.owner._id}`)
      setsubscribed(res.data.subscribed);

      //instant update sub count based on action
      setsubcount(prev => res.data.subscribed ? prev + 1 : prev - 1);

    } catch (err) {
      console.log("Failed to toggle subscription", err);
    } finally {
      setsubloading(false);
    }

  }

  if (!video)
    return (
      <div className="flex justify-center items-center h-screen">

        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>

      </div>
    );

  return (

    <div className="h-[calc(100vh-66.4px)] overflow-hidden bg-gray-100 px-6 lg:px-6 py-3">
      <div className="max-w-10xl mx-auto h-full grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE - VIDEO */}
        <div className="lg:col-span-2 overflow-y-auto pr-2 custom-scrollbar pb-8">

          {/* 🎬 Video Player */}
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg">
            <video
              src={video.videoUrl}
              controls
              className="w-full h-full object-contain"
            />
          </div>

          {/* 📝 Title */}
          <h1 className="text-2xl font-semibold mt-4 leading-snug">
            {video.title}
          </h1>

          {/* 📊 Views */}
          <p className="text-sm text-gray-500 mt-1">
            {video.views} views • {timeAgo(video.createdAt)}
          </p>

          {/* 🔥 Channel + Actions */}
          <div className="flex items-center justify-between mt-5">

            {/* LEFT: Channel Info */}
            <div className="flex items-center gap-5">

              {/* Avatar */}
              <div
                className="w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center font-bold text-lg cursor-pointer"
                onClick={() => navigate(`/channel/${video.owner._id}`)}
              >
                {video.owner?.username?.charAt(0).toUpperCase()}
              </div>

              {/* Name + Subs */}
              <div>
                <p
                  className="font-semibold cursor-pointer hover:underline"
                  onClick={() => navigate(`/channel/${video.owner._id}`)}
                >
                  {video.owner?.username}
                </p>

                <p className="text-xs text-gray-500">
                  {subcount} subscribers
                </p>
              </div>

              {/* 🔴 Subscribe Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlesubscribe();
                }}
                disabled={subloading}
                className={`ml-4 px-5 py-2 text-sm cursor-pointer font-medium rounded-full transition ${subscribed
                    ? "bg-gray-200 text-black"
                    : "bg-red-600 hover:bg-red-700 text-white"
                  } ${subloading && "opacity-50 cursor-not-allowed"}`}
              >
                {subloading
                  ? ""
                  : subscribed
                    ? "Subscribed"
                    : "Subscribe"}
              </button>

            </div>

            {/* RIGHT: Like Button */}
            <button
              onClick={handlelike}
              className="flex cursor-pointer items-center gap-2 px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition active:scale-95"
            >
              <span className="text-lg">👍</span>
              <span className="text-sm font-medium">{likes}</span>
            </button>

          </div>

          {/* 📄 Description */}
          {video.description && (
            <div className="mt-5 bg-gray-100 p-4 rounded-xl text-sm text-gray-800">
              {video.description}
            </div>
          )}

          {/* 💬 Comments */}
          <div className="mt-10">

            {/* Header */}
            <h2 className="text-lg font-semibold mb-4">
              {comments.length} Comments
            </h2>

            {/* Add Comment */}
            <div className="flex gap-3 mb-6">

              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700">
                U
              </div>

              <div className="flex-1">

                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commenttext}
                  onChange={(e) => setcommenttext(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleaddcomments();
                  }}
                  className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm bg-transparent"
                />

                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleaddcomments}
                    className="cursor-pointer bg-black text-white px-4 py-1.5 rounded-full text-sm hover:bg-gray-800 transition"
                  >
                    Comment
                  </button>
                </div>

              </div>

            </div>

            {/* Comment List */}
            <div className="space-y-5">

              {comments.map((comm) => (

                <div key={comm._id} className="flex gap-3">

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
                    {comm.owner?.username?.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div>

                    <p className="text-sm font-medium">
                      {comm.owner?.username}
                      <span className="text-gray-500 text-xs ml-2">
                        {timeAgo(comm.createdAt)}
                      </span>
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      {comm.content}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* RIGHT SIDE - RECOMMENDED VIDEOS */}
        <div className="overflow-y-auto custom-scrollbar pr-2 space-y-4">
          {recommended.map((vid) => (

            <Link
              key={vid._id}
              to={`/video/${vid._id}`}
              className="flex gap-3 rounded-xl transition duration-200 cursor-pointer hover:bg-gray-100 p-2 bg-white shadow-sm"
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
                  {vid.views} views • {timeAgo(vid.createdAt)}
                </p>
              </div>

            </Link>

          ))}

        </div>


      </div>
    </div>



  );
};

export default VideoPage;