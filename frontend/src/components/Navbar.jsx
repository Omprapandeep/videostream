import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUpload } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useState } from 'react';


const Navbar = () => {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };


  const [search, setsearch] = useState("");

  return (
    <nav className='bg-white border-b shadow-sm px-8 py-3 flex items-center justify-between'>

      {/* Logo */}
      <Link to="/" className='text-2xl font-bold text-red-600 tracking-wide'>
        VideoTube
      </Link>

      {/* Search Bar */}
      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">

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
      <div className="flex items-center gap-5">

        {user ? (

          <>
            {/* Upload */}
            <Link
              to="/upload"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:bg-blue-800 transition"
            >
              <FiUpload size={16} />
              Upload
            </Link>

            {/* Profile */}
            <span className="flex items-center gap-2 text-gray-700 font-medium">
              <FaUserCircle size={26} />
              {user.username}
            </span>

            <Link to="/mychannel">
              My Channel
            </Link>

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