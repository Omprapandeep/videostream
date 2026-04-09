import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUpload } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from 'react';
import api from '../services/api';
import { FiMenu } from "react-icons/fi";

const Navbar = ({ toggle }) => {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };


  const [search, setsearch] = useState("");
  const [suggestions, setsuggestions] = useState([]);

  useEffect(() => {

    const delay = setTimeout(() => {
      if (search.trim()) {
        fetchsuggestions();
      } else {
        setsuggestions([])
      }
    }, 300)//debounce

    return () => {
      clearTimeout(delay);
    }
  }, [search])

  //cleanup 
  useEffect(() => {
    const handleClick = () => setsuggestions([]);

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, []);

  const fetchsuggestions = async () => {
    try {
      const res = await api.get(`/videos/all?search=${search}&limit=4`);
      setsuggestions(res.data.videos);
    } catch (er) {
      console.log(er);
    }
  }

  return (
    <nav className='bg-white/50  backdrop-blur-md border-b border-gray-200 sticky top-0 z-20 shadow-sm px-4 md:px-8 py-3 flex items-center justify-between'>

      <div className="flex items-center gap-4">

        {/* Hamburger (desktop only) */}
        <button
          onClick={toggle}
          className="hidden cursor-pointer md:block p-2 hover:bg-gray-200 rounded-full"
        >
          <FiMenu size={22} />
        </button>

        {/* Logo */}
        <Link to="/" className='text-2xl font-bold text-red-600 tracking-wide'>
          VideoTube
        </Link>

      </div>

      {/* Search Bar */}
      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative" onClick={(e) => e.stopPropagation()}>{/*  //event bubbling */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border mt-1 rounded-md shadow-lg z-50">

              {suggestions.map((video) => (
                <div
                  key={video._id}
                  onClick={() => {
                    navigate(`/video/${video._id}`);
                    setsuggestions([]); // close dropdown
                    setsearch("");
                  }}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer rounded-md  text-sm flex gap-3 items-center"
                >

                  <img
                    src={video.thumbnailUrl}
                    className="w-12 h-8 object-cover rounded"
                  />

                  <span className="truncate">{video.title}</span>

                </div>
              ))}

            </div>
          )}
          {/* Search Icon */}
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m1.6-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {/* Input */}
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setsearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/?search=${search}`);
              }
            }}
            className="w-full border border-gray-300 rounded-full pl-11 pr-4 py-2.5 text-sm 
                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                 transition"
          />

        </div>
      </div>

      {/* Right Side */}
     <div className="flex items-center gap-3 md:gap-5">

        {user ? (

          <>

          

            {/* Upload */}
            <Link
              to="/upload"
              className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition"
            >
              <FiUpload size={16} />
              <span className="hidden md:block">Upload</span>
            </Link>

            {/* Profile */}
            <span className="flex items-center gap-2 text-gray-700 font-medium">
              <FaUserCircle size={26} />
              {user.username}
            </span>

          
            {/* Logout */}
            <button
              onClick={logout}
              className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>

        ) : (

          <>
            <Link to="/login" className="text-gray-700 font-medium hover:text-red-500">
              Login
            </Link>

            <Link
              to="/register"
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Register
            </Link>
          </>

        )}

      </div>

    </nav>
  )
}

export default Navbar