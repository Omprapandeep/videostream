import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'


const Channelpage = () => {
    const navigate = useNavigate();
    const { userId } = useParams();

    const [videos, setvideos] = useState([]);
    const [user, setuser] = useState(null);
    const [activeTab, setactiveTab] = useState("videos");

    useEffect(() => {
        fetchChannelVideos();
    }, [userId]);

    const fetchChannelVideos = async () => {
        try {
            const res = await api.get(`/videos/channel/${userId}`);
            setvideos(res.data.videos);
            if (res.data.videos.length > 0) {
                setuser(res.data.videos[0].owner);
            }

        } catch (err) {
            console.log("Failed to fetch channel videos", err);
        }
    }

    return (
        <div className="bg-[#0f0f0f] min-h-[calc(100vh-66.8px)] text-white">


            {/* 🔹 Header */}
            <div className="max-w-6xl mx-auto px-4 py-6">

                <div className="flex items-center justify-between">

                    {/* Left */}
                    <div className="flex items-center gap-4">

                        {/* Avatar */}
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-xl font-semibold">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div>
                            <h2 className="text-xl font-semibold">
                                {user?.username}
                            </h2>

                            <p className="text-sm text-gray-400 mt-1">
                                {videos.length} videos
                            </p>
                        </div>
                    </div>

                    {/* Right */}
                    <button className="px-5 py-2 rounded-full text-sm font-medium transition cursor-pointer bg-red-600 text-white hover:bg-red-700">
                        Subscribe
                    </button>

                </div>

                {/* Tabs (like YouTube) */}
                <div className="flex gap-6 mt-6 border-b border-gray-800 text-sm">
                    <span className={`pb-2 cursor-pointer ${activeTab === "videos"
                        ? "border-b-2 border-white font-medium"
                        : "text-gray-400 hover:text-white"
                        }`}
                        onClick={() => setactiveTab("videos")}
                    >
                        Videos
                    </span>
                    <span className={`pb-2 cursor-pointer ${activeTab === "about"
                        ? "border-b-2 border-white font-medium"
                        : "text-gray-400 hover:text-white"
                        }`}
                        onClick={() => setactiveTab("about")}
                    >
                        About
                    </span>
                </div>

            </div>

            {/* 🔹 Videos */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                {activeTab === "videos" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                        {videos.map(video => (
                            <div key={video._id}
                                onClick={() => navigate(`/video/${video._id}`)}
                                className="cursor-pointer group">

                                {/* Thumbnail */}
                                <div className="rounded-lg overflow-hidden bg-gray-900">
                                    <img
                                        src={video.thumbnailUrl}
                                        className="w-full h-44 object-cover group-hover:opacity-80 transition"
                                    />
                                </div>

                                {/* Info */}
                                <div className="mt-3 flex gap-3">

                                    {/* Small avatar */}
                                    <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-sm">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Text */}
                                    <div className="flex justify-between w-full">
                                        <div>
                                            <p className="text-sm font-medium leading-snug line-clamp-2">
                                                {video.title}
                                            </p>

                                            <p className="text-xs text-gray-400 mt-1">
                                                {user?.username}
                                            </p>
                                        </div>


                                        <p className="text-xs text-gray-400">
                                            {video.views || 0} views
                                        </p>
                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

                {activeTab === "about" && (
                    <div className="max-w-2xl">

                        <h3 className="text-lg font-semibold mb-4">About Channel</h3>

                        <div className="space-y-4 text-sm text-gray-300">

                            <div>
                                <span className="text-gray-400">Channel Name:</span>
                                <p className="text-white">{user?.username}</p>
                            </div>

                            <div>
                                <span className="text-gray-400">Total Videos:</span>
                                <p className="text-white">{videos.length}</p>
                            </div>

                            <div>
                                <span className="text-gray-400">Joined:</span>
                                <p className="text-white">
                                    {videos[0]?.createdAt
                                        ? new Date(videos[0].createdAt).toDateString()
                                        : "N/A"}
                                </p>
                            </div>

                            <div>
                                <span className="text-gray-400">Description:</span>
                                <p className="text-white">
                                    This is {user?.username}'s channel. More features coming soon 🚀
                                </p>
                            </div>

                        </div>

                    </div>
                )}
            </div>

        </div>
    )
}

export default Channelpage;
