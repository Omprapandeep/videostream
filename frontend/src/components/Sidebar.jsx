
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiYoutube, FiUser, FiTrendingUp } from "react-icons/fi";
import { MdMusicNote, MdSportsEsports, MdOutlineNewspaper } from "react-icons/md";

const Sidebar = ({ open }) => {
  const location = useLocation();

  const menu = [
    { name: "Home", icon: <FiHome size={19} />, path: "/" },
    { name: "Subscriptions", icon: <FiYoutube size={19} />, path: "/feed" },
    { name: "My Channel", icon: <FiUser size={19} />, path: "/mychannel" },
  ];

  const explore = [
    { name: "Trending", icon: <FiTrendingUp size={19} />, path: "/explore/trending" },
    { name: "Music", icon: <MdMusicNote size={19} />, path: "/explore/music" },
    { name: "Gaming", icon: <MdSportsEsports size={19} />, path: "/explore/gaming" },
    { name: "News", icon: <MdOutlineNewspaper size={19} />, path: "/explore/news" },
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        title={!open ? item.name : undefined}
        className={`
          relative flex items-center rounded-xl text-[13px] no-underline
          transition-all duration-150 select-none
          ${open ? "gap-3 px-3 py-2.5 justify-start" : "justify-center p-2.5"}
          ${isActive
            ? "font-medium text-purple-300 border border-purple-500/28"
            : "font-normal text-white/40 border border-transparent hover:text-white/70"
          }
        `}
        style={{
          background: isActive ? "rgba(124,58,237,0.14)" : undefined,
          boxShadow: isActive ? "0 0 12px rgba(124,58,237,0.08)" : undefined,
        }}
        onMouseEnter={e => {
          if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        }}
        onMouseLeave={e => {
          if (!isActive) e.currentTarget.style.background = "transparent";
        }}
      >
        {/* Active left bar */}
        {isActive && (
          <div
            className="absolute left-0 top-[18%] bottom-[18%] w-0.75 rounded-r-sm"
            style={{ background: "linear-gradient(180deg, #7c3aed, #22c55e)" }}
          />
        )}

        {/* Icon */}
        <span className={isActive ? "text-purple-400" : "text-white/38"}>
          {item.icon}
        </span>

        {/* Label */}
        {open && (
          <span className="truncate">{item.name}</span>
        )}
      </Link>
    );
  };

  const Divider = () => (
    <div
      className="mx-1 my-1.5"
      style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}
    />
  );

  const SectionLabel = ({ text }) => open ? (
    <p className="text-[11px] font-semibold uppercase tracking-widest px-3 pb-1 m-0"
      style={{ color: "rgba(124,58,237,0.9)", letterSpacing: "0.09em" }}
    >
      {text}
    </p>
  ) : null;

  return (
    <div
      className="w-full h-full flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden p-1.5 box-border"
      style={{
        background: "rgba(10,10,15,0.85)",
        borderRight: "0.5px solid rgba(124,58,237,0.15)",
      }}
    >

      {/* Main menu */}
      <div className="flex flex-col gap-0.5">
        {menu.map(item => <NavItem key={item.name} item={item} />)}
      </div>

      <Divider />
      <SectionLabel text="Explore" />

      <div className="flex flex-col gap-0.5">
        {explore.map(item => <NavItem key={item.name} item={item} />)}
      </div>

      <Divider />
      <SectionLabel text="Subscriptions" />

      {open && (
        <div className="flex flex-col gap-0.5">
          {[1, 2, 3].map(ch => (
            <div
              key={ch}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer
                text-[13px] text-white/40 transition-all duration-150 hover:text-white/70"
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div
                className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center
                  text-[11px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #7c3aed, #22c55e)" }}
              >
                C
              </div>
              <span className="truncate">Channel {ch}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Sidebar;








// import React from 'react'
// import { Link, useLocation } from 'react-router-dom'
// import { FiHome, FiYoutube, FiUser, FiTrendingUp } from "react-icons/fi";
// import { MdMusicNote, MdSportsEsports, MdOutlineNewspaper } from "react-icons/md";

// const Sidebar = ({ open }) => {

//     const location = useLocation();

//     // 🔹 Main menu
//     const menu = [
//         {
//             name: "Home",
//             icon: <FiHome size={20} />,
//             path: "/"
//         },
//         {
//             name: "Subscriptions",
//             icon: <FiYoutube size={20} />,
//             path: "/feed"
//         },
//         {
//             name: "My Channel",
//             icon: <FiUser size={20} />,
//             path: "/mychannel"
//         }
//     ];

//     // 🔹 Explore section
//     const explore = [
//         {
//             name: "Trending",
//             icon: <FiTrendingUp size={20} />,
//             path: "/explore/trending"
//         },
//         {
//             name: "Music",
//             icon: <MdMusicNote size={20} />,
//             path: "/explore/music"
//         },
//         {
//             name: "Gaming",
//             icon: <MdSportsEsports size={20} />,
//             path: "/explore/gaming"
//         },
//         {
//             name: "News",
//             icon: <MdOutlineNewspaper size={20} />,
//             path: "/explore/news"
//         }
//     ];

//     const renderItem = (item) => {
//         const isActive = location.pathname === item.path;

//         return (
//             <Link
//                 key={item.name}
//                 to={item.path}
//                 className={`flex items-center gap-4 p-2 rounded-lg transition
//           ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}
//         `}
//             >
//                 <div>{item.icon}</div>
//                 {open && <span>{item.name}</span>}
//             </Link>
//         );
//     };

//     return (
//         <div className="bg-white h-full  overflow-y-auto border-r p-2">

//             {/* 🔹 Main Menu */}
//             <div className="flex flex-col gap-2">
//                 {menu.map(renderItem)}
//             </div>

//             <hr className="my-4" />

//             {/* 🔥 Explore Section */}
//             {open && (<h3 className="text-sm font-semibold text-gray-600 mb-2 px-2">
//                 Explore
//             </h3>)}
//             <div>
//                 <div className="flex flex-col gap-2">
//                     {explore.map(renderItem)}
//                 </div>
//             </div>


//             <hr className="my-4" />

//             {/* 🔥 Subscriptions (placeholder for now) */}
//             {open && (
//                 <div>
//                     <h3 className="text-sm font-semibold text-gray-600 mb-2 px-2">
//                         Subscriptions
//                     </h3>

//                     {[1, 2, 3].map((ch) => (
//                         <div
//                             key={ch}
//                             className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
//                         >
//                             <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
//                                 C
//                             </div>
//                             <span className="text-sm">Channel {ch}</span>
//                         </div>
//                     ))}
//                 </div>
//             )}

//         </div>
//     )
// }

// export default Sidebar;