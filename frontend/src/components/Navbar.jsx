import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUpload } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className='bg-white border-b shadow-sm px-8 py-3 flex items-center justify-between'>

      {/* Logo */}
      <Link to="/" className='text-2xl font-bold text-red-600 tracking-wide'>
        VideoTube
      </Link>

      {/* Search Bar */}
      <div className="flex-1 max-w-lg mx-10">
        <input
          type="text"
          placeholder="Search videos..."
          className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        />
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
              <FiUpload size={16}/>
              Upload
            </Link>

            {/* Profile */}
            <span className="flex items-center gap-2 text-gray-700 font-medium">
              <FaUserCircle size={26}/>
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