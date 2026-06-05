import React from 'react'
import { Link } from 'react-router-dom'

const VideoCard = ({ video }) => {
    return (
        <Link to={`/video/${video._id}`} className="block no-underline group">

            <div
                className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
                    hover:-translate-y-1"
                style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.border = "0.5px solid rgba(124,58,237,0.35)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(124,58,237,0.15)";
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.border = "0.5px solid rgba(255,255,255,0.08)";
                    e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
                }}
            >

                {/* Thumbnail */}
                <div className="relative overflow-hidden bg-black">
                    <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-44  object-cover transition-transform duration-500  "
                    />

                    {/* Dark gradient overlay at bottom */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",
                        }}
                    />

                    {/* Views badge */}
                    <div
                        className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] text-white/90"
                        style={{
                            background: "rgba(0,0,0,0.60)",
                            border: "0.5px solid rgba(255,255,255,0.10)",
                            backdropFilter: "blur(6px)",
                        }}
                    >
                        <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        {video.views}
                    </div>
                </div>

                {/* Content */}
                <div className="p-3">
                    <div className="flex gap-2.5">

                        {/* Avatar */}
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center
                                text-[12px] font-bold text-white shrink-0 mt-0.5"
                            style={{
                                background: "linear-gradient(135deg, #7c3aed, #22c55e)",
                            }}
                        >
                            {video.owner?.username?.charAt(0).toUpperCase()}
                        </div>

                        {/* Title + meta */}
                        <div className="flex flex-1 justify-between items-start gap-2 min-w-0">

                            <div className="min-w-0">
                                <h3 className="text-[13px] font-medium text-white/90 leading-snug line-clamp-2">
                                    {video.title}
                                </h3>
                                <p className="text-[11px] text-white/40 mt-1 truncate">
                                    {video.owner?.username}
                                </p>
                            </div>

                            {/* Likes */}
                            <div className="flex items-center gap-1 text-[11px] text-white/40 shrink-0 mt-0.5">
                                <svg width={11} height={11} viewBox="0 0 24 24" fill="rgba(167,139,250,0.7)" stroke="none">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <span>{video.likes}</span>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </Link>
    )
}

export default VideoCard