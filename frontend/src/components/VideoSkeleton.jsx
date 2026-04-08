import React from 'react'

const VideoSkeleton = () => {
  return (
    <div className="animate-pulse">
      
      {/* Thumbnail */}
      <div className="bg-gray-300 w-full h-44 rounded-xl"></div>

      {/* Content */}
      <div className="flex mt-3 gap-3">
        
        {/* Avatar */}
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

        {/* Text */}
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>

      </div>
    </div>
  )
}

export default VideoSkeleton;
