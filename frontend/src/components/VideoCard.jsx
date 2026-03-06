import React from 'react'
import { Link } from 'react-router-dom'

const VideoCard = ({video}) => {
    return (
        <Link to={`/video/${video._id}`}>
            <div className="bg-black rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                />

                <div className="p-3">
                    <h3 className="font-semibold text-gray-800 line-clamp-2">
                        {video.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {video.owner?.username}
                    </p>

                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>👁 {video.views}</span>
                        <span>❤️ {video.likes}</span>
                    </div>
                </div>

            </div>
        </Link>
    )
}

export default VideoCard
