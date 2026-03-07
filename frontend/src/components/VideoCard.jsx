import React from 'react'
import { Link } from 'react-router-dom'

const VideoCard = ({ video }) => {
    return (
        <Link to={`/video/${video._id}`}>

            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">

                {/* thumbnail container */}
                <div className="relative overflow-hidden"> {/* added for overlay + zoom */}

                    <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-45 object-cover "
                    // added zoom hover
                    />

                    {/* added overlay for views */}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                        👁 {video.views}
                    </div>

                </div>

                {/* content */}
                <div className="p-2">

                    {/* added channel + title layout */}
                    <div className="flex gap-3">

                        {/* avatar */}
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
                            {video.owner?.username?.charAt(0).toUpperCase()}
                        </div>

                        {/* changed: make content take full width */}
                        <div className="flex flex-1 justify-between items-start"> {/* changed */}

                            {/* title + username */}
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                                    {video.title}
                                </h3>

                                <p className="text-xs text-gray-500 mt-1">
                                    {video.owner?.username}
                                </p>
                            </div>

                            {/* likes */}
                            <div className="text-xs text-gray-400 ml-3"> {/* added small margin */}
                                ❤️ {video.likes}
                            </div>

                        </div>

                    </div>
                </div>

            </div>

        </Link>
    )
}

export default VideoCard