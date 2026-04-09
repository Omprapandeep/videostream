import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiYoutube, FiUser, FiTrendingUp } from "react-icons/fi";
import { MdMusicNote, MdSportsEsports, MdOutlineNewspaper } from "react-icons/md";

const Sidebar = ({ open }) => {

    const location = useLocation();

    // 🔹 Main menu
    const menu = [
        {
            name: "Home",
            icon: <FiHome size={20} />,
            path: "/"
        },
        {
            name: "Subscriptions",
            icon: <FiYoutube size={20} />,
            path: "/feed"
        },
        {
            name: "My Channel",
            icon: <FiUser size={20} />,
            path: "/mychannel"
        }
    ];

    // 🔹 Explore section
    const explore = [
        {
            name: "Trending",
            icon: <FiTrendingUp size={20} />,
            path: "/explore/trending"
        },
        {
            name: "Music",
            icon: <MdMusicNote size={20} />,
            path: "/explore/music"
        },
        {
            name: "Gaming",
            icon: <MdSportsEsports size={20} />,
            path: "/explore/gaming"
        },
        {
            name: "News",
            icon: <MdOutlineNewspaper size={20} />,
            path: "/explore/news"
        }
    ];

    const renderItem = (item) => {
        const isActive = location.pathname === item.path;

        return (
            <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 p-2 rounded-lg transition
          ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}
        `}
            >
                <div>{item.icon}</div>
                {open && <span>{item.name}</span>}
            </Link>
        );
    };

    return (
        <div className="bg-white h-full  overflow-y-auto border-r p-2">

            {/* 🔹 Main Menu */}
            <div className="flex flex-col gap-2">
                {menu.map(renderItem)}
            </div>

            <hr className="my-4" />

            {/* 🔥 Explore Section */}
            {open && (<h3 className="text-sm font-semibold text-gray-600 mb-2 px-2">
                Explore
            </h3>)}
            <div>
                <div className="flex flex-col gap-2">
                    {explore.map(renderItem)}
                </div>
            </div>


            <hr className="my-4" />

            {/* 🔥 Subscriptions (placeholder for now) */}
            {open && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2 px-2">
                        Subscriptions
                    </h3>

                    {[1, 2, 3].map((ch) => (
                        <div
                            key={ch}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                        >
                            <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                                C
                            </div>
                            <span className="text-sm">Channel {ch}</span>
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}

export default Sidebar;