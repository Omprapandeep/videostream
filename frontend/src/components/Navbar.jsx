

import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUpload, FiMenu, FiLogOut, FiX } from "react-icons/fi";
import { HiOutlineSearch } from "react-icons/hi";
import api from '../services/api';
import logo from "../assets/appreal.png";
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggle, mobileToggle }) => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout: handleLogout } = useAuth();

  const logout = () => {
    handleLogout();
    navigate("/login");
  };

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mobilesearchopen ,setmobilesearchopen] = useState(false);  
  const mobileinputref = useRef(null);



  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) fetchSuggestions();
      else setSuggestions([]);
    }, 150);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    const handleClick = () => setSuggestions([]);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if(mobilesearchopen){
      setTimeout(()=>mobileinputref.current?.focus(),50);
    }else{
      setSearch("");
      setSuggestions([]);
    }
}, [mobilesearchopen]);

  const fetchSuggestions = async () => {
    try {
      const res = await api.get(`/videos/all?search=${search}&limit=4`);
      setSuggestions(res.data.videos);
    } catch (err) { console.error(err); }
  };

  const HamburgerBtn = ({ onClick, className }) => (
    <button
      onClick={onClick}
      className={`${className} w-9 h-9 rounded-xl cursor-pointer flex items-center justify-center
        transition-all duration-150 border border-purple-500/30 hover:border-purple-500/50`}
      style={{ background: "rgba(124,58,237,0.12)" }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.22)"}
      onMouseLeave={e => e.currentTarget.style.background = "rgba(124,58,237,0.12)"}
    >
      <FiMenu size={17} className="text-purple-400" />
    </button>
  );

  const handlesearchsubmit = ()=>{
    
    navigate(`/?search=${search}`);
    setSuggestions([]);
    setmobilesearchopen(false);
  }
 
  const Suggestiondropdown = ({inputref})=>(
   
            suggestions.length > 0 && (
              <div
                className="absolute top-[calc(100%+8px)] left-0 right-0 z-50
                  rounded-2xl overflow-hidden border border-purple-500/25"
                style={{
                  background: "#0f0a1e",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                }}
              >
                {suggestions.map(video => (
                  <div
                    key={video._id}
                    onClick={() => { navigate(`/video/${video._id}`); setSuggestions([]); setSearch("");setmobilesearchopen(false); }}
                    className="flex items-center gap-3 px-3.5 py-2.5 cursor-pointer
                      transition-all duration-150"
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.12)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <img
                      src={video.thumbnailUrl}
                      className="w-13 h-8 object-cover rounded-md shrink-0"
                      alt=""
                    />
                    <span className="text-[13px] text-white/80 truncate">{video.title}</span>
                  </div>
                ))}
              </div>
            )
  );
  

   const IconBtn = ({ onClick, children, className = "" }) => (
    <button
      onClick={onClick}
      className={`w-9 h-9 rounded-xl cursor-pointer flex items-center justify-center
        transition-all duration-150 border border-purple-500/30 hover:border-purple-500/50 ${className}`}
      style={{ background: "rgba(124,58,237,0.12)" }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.22)"}
      onMouseLeave={e => e.currentTarget.style.background = "rgba(124,58,237,0.12)"}
    >
      {children}
    </button>
  );
  

  return (

    <>
    <nav
      className="border-b border-purple-500/20 sticky top-0 z-40 "
      style={{
        background: "rgba(10,10,15,0.92)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 1px 24px rgba(124,58,237,0.08)",
      }}
    >
      <div className="flex items-center gap-3 px-4 md:px-5 py-2.5">

        {/* ── Left: hamburgers + logo ── */}
        <div className="flex items-center gap-2.5 shrink-0">
         {/* Mobile hamburger */}
            <IconBtn onClick={mobileToggle} className="flex md:hidden">
              <FiMenu size={17} className="text-purple-400" />
            </IconBtn>
            {/* Desktop hamburger */}
            <IconBtn onClick={toggle} className="hidden md:flex">
              <FiMenu size={17} className="text-purple-400" />
            </IconBtn>
            <Link to="/">
              <img src={logo} alt="Vibe" className="h-9 w-auto" />
            </Link>
        </div>

        {/* ── Center: search desktop only  ── */}
        <div
          className="flex-1 max-w-xl mx-auto hidden md:block"
          onClick={e => e.stopPropagation()}
        >
          <div className="relative">
            <HiOutlineSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none"
              size={15}
            />
            <input
              type="text"
              placeholder="Search videos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") { handlesearchsubmit(); }
              }}
              className="w-full rounded-full text-[13px] text-white placeholder-white/25
                outline-none transition-all duration-200"
              style={{
                padding: "8px 16px 8px 38px",
                background: "rgba(124,58,237,0.08)",
                border: "0.5px solid rgba(124,58,237,0.25)",
              }}
              onFocus={e => {
                e.target.style.background = "rgba(124,58,237,0.14)";
                e.target.style.border = "0.5px solid rgba(124,58,237,0.60)";
                e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.10)";
              }}
              onBlur={e => {
                e.target.style.background = "rgba(124,58,237,0.08)";
                e.target.style.border = "0.5px solid rgba(124,58,237,0.25)";
                e.target.style.boxShadow = "none";
              }}
            />

            <Suggestiondropdown />

          
          </div>
        </div>

        {/* ── Right: actions ── */}
        <div className="flex items-center gap-2 shrink-0 ml-auto md:ml-0 ">
           
           {/* Mobile search */}
           <IconBtn onClick={() =>setmobilesearchopen(true)} className="md:hidden flex">
             <HiOutlineSearch size={17} className="text-purple-400" />
           </IconBtn>

          {authLoading ? (
            <div className="w-20 h-9 rounded-xl bg-purple-500/10 animate-pulse border border-purple-500/20" />
          ) : user ? (
            <>
              {/* Upload */}
              <Link
                to="/upload"
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl
                  text-[13px] font-medium text-white transition-opacity duration-150
                  hover:opacity-85"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  boxShadow: "0 2px 16px rgba(34,197,94,0.28)",
                }}
              >
                <FiUpload size={14} />
                <span className="hidden md:block">Upload</span>
              </Link>

              {/* User pill */}
              <Link
               to="/myprofile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                  border border-purple-500/28  transition-all hover:border-purple-500/50"
                style={{ background: "rgba(124,58,237,0.12)" }}
                 onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.22)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(124,58,237,0.12)"}
              >
                <div
                  className="w-6.5 h-6.5 rounded-full flex items-center justify-center
                    text-[11px] font-bold text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #22c55e)" }}
                >
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <span className="hidden md:block text-[13px] font-medium text-purple-300">
                  {user.username}
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px]
                  font-medium text-red-400 cursor-pointer transition-all duration-150
                  border border-red-400/22 hover:border-red-400/40"
                style={{ background: "rgba(248,113,113,0.08)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.16)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
              >
                <FiLogOut size={14} />
                <span className="hidden md:block">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-[13px] text-purple-400
                  border border-purple-500/30 transition-all duration-150 hover:border-purple-500/50"
                style={{ background: "rgba(124,58,237,0.08)" }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-[13px] font-medium text-white
                  transition-opacity duration-150 hover:opacity-85"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #22c55e)",
                  boxShadow: "0 2px 16px rgba(124,58,237,0.28)",
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>

     
     
      {mobilesearchopen && (
        <div
          className="fixed inset-0 z-50 flex flex-col md:hidden"
          style={{ background: "rgba(10,10,15,0.98)", backdropFilter: "blur(16px)" }}
        >
          {/* Top bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-purple-500/20">
            <div
              className="relative flex-1"
              onClick={e => e.stopPropagation()}
            >
              <HiOutlineSearch
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none"
                size={16}
              />
              <input
                ref={mobileinputref}
                type="text"
                placeholder="Search videos..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handlesearchsubmit(); }}
                className="w-full rounded-full text-[14px] text-white placeholder-white/30 outline-none"
                style={{
                  padding: "10px 16px 10px 40px",
                  background: "rgba(124,58,237,0.12)",
                  border: "0.5px solid rgba(124,58,237,0.50)",
                  boxShadow: "0 0 0 3px rgba(124,58,237,0.10)",
                }}
              />
            </div>

            {/* Close */}
            <button
              onClick={() => setmobilesearchopen(false)}
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                border border-white/10 text-white/50 hover:text-white transition-all"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <FiX size={17} />
            </button>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 ? (
            <div className="flex-1 overflow-y-auto px-4 pt-3">
              {suggestions.map(video => (
                <div
                  key={video._id}
                  onClick={() => {
                    navigate(`/video/${video._id}`);
                    setSuggestions([]);
                    setSearch("");
                    setmobilesearchopen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer
                    transition-all duration-150 mb-1"
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <img
                    src={video.thumbnailUrl}
                    className="w-16 h-10 object-cover rounded-lg shrink-0"
                    alt=""
                  />
                  <span className="text-[14px] text-white/80">{video.title}</span>
                </div>
              ))}
            </div>
          ) : (
            /* Empty hint */
            search.trim() === "" && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 pb-20">
                <HiOutlineSearch size={40} className="text-purple-500/30" />
                <p className="text-white/20 text-sm">Type to search videos</p>
              </div>
            )
          )}
        </div>
      )}
  </>

  );
};

export default Navbar;



// import React from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { FiUpload, FiMenu, FiLogOut } from "react-icons/fi";
// import { FaUserCircle } from "react-icons/fa";
// import { HiOutlineSearch } from "react-icons/hi";
// import { useState, useEffect } from 'react';
// import api from '../services/api';
// import { FiMenu } from "react-icons/fi";
// import logo from "../assets/appreal.png";


// const Navbar = ({ toggle,mobileToggle }) => {

//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user"));

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };


//   const [search, setsearch] = useState("");
//   const [suggestions, setsuggestions] = useState([]);

//   useEffect(() => {

//     const delay = setTimeout(() => {
//       if (search.trim()) {
//         fetchsuggestions();
//       } else {
//         setsuggestions([])
//       }
//     }, 300)//debounce

//     return () => {
//       clearTimeout(delay);
//     }
//   }, [search])

//   //cleanup 
//   useEffect(() => {
//     const handleClick = () => setsuggestions([]);

//     window.addEventListener("click", handleClick);

//     return () => window.removeEventListener("click", handleClick);
//   }, []);

//   const fetchsuggestions = async () => {
//     try {
//       const res = await api.get(`/videos/all?search=${search}&limit=4`);
//       setsuggestions(res.data.videos);
//     } catch (er) {
//       console.log(er);
//     }
//   }

//   return (
//     <nav className='   border-b border-gray-200 sticky top-0 z-20 shadow-sm px-4 md:px-8 py-3 flex items-center justify-between'>

//       <div className="flex items-center gap-4">

//         {/* Hamburger (desktop only) */}
//         <button
//           onClick={toggle}
//           className="hidden cursor-pointer md:block p-2 hover:bg-gray-200 rounded-full"
//         >
//           <FiMenu size={22} />
//         </button>

//         {/* Logo */}
//         <Link to="/" className='text-2xl font-bold text-red-600 tracking-wide'>
//           <img src={logo} alt="Logo" className="logo" />
//         </Link>

//       </div>

//       {/* Search Bar */}
//       {/* Search Bar */}
//       <div className="flex-1 max-w-xl mx-8">
//         <div className="relative" onClick={(e) => e.stopPropagation()}>{/*  //event bubbling */}
//           {suggestions.length > 0 && (
//             <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border mt-1 rounded-md shadow-lg z-50">

//               {suggestions.map((video) => (
//                 <div
//                   key={video._id}
//                   onClick={() => {
//                     navigate(`/video/${video._id}`);
//                     setsuggestions([]); // close dropdown
//                     setsearch("");
//                   }}
//                   className="px-4 py-2 hover:bg-gray-200 cursor-pointer rounded-md  text-sm flex gap-3 items-center"
//                 >

//                   <img
//                     src={video.thumbnailUrl}
//                     className="w-12 h-8 object-cover rounded"
//                   />

//                   <span className="truncate">{video.title}</span>

//                 </div>
//               ))}

//             </div>
//           )}
//           {/* Search Icon */}
//           <svg
//             className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M21 21l-4.35-4.35m1.6-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
//             />
//           </svg>

//           {/* Input */}
//           <input
//             type="text"
//             placeholder="Search videos..."
//             value={search}
//             onChange={(e) => setsearch(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 navigate(`/?search=${search}`);
//               }
//             }}
//             className="w-full border border-gray-300 rounded-full pl-11 pr-4 py-2.5 text-sm 
//                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
//                  transition"
//           />

//         </div>
//       </div>

//       {/* Right Side */}
//      <div className="flex items-center gap-3 md:gap-5">

//         {user ? (

//           <>

          

//             {/* Upload */}
//             <Link
//               to="/upload"
//               className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition"
//             >
//               <FiUpload size={16} />
//               <span className="hidden md:block">Upload</span>
//             </Link>

//             {/* Profile */}
//             <span className="flex items-center gap-2 text-gray-700 font-medium">
//               <FaUserCircle size={26} />
//               {user.username}
//             </span>

          
//             {/* Logout */}
//             <button
//               onClick={logout}
//               className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
//             >
//               Logout
//             </button>
//           </>

//         ) : (

//           <>
//             <Link to="/login" className="text-gray-700 font-medium hover:text-red-500">
//               Login
//             </Link>

//             <Link
//               to="/register"
//               className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
//             >
//               Register
//             </Link>
//           </>

//         )}

//       </div>

//     </nav>
//   )
// }

// export default Navbar