import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className='bg-white shadow-md px-6 py-4 flex justify-between items-center'>

      {/* Logo */}
      <Link to="/" className='text-2xl font-bold text-red-600'>
        VideoTube
      </Link>

      <div className="flex items-center gap-4">

        {user ? (

          <>
            <span className="font-medium text-gray-700">
              {user.username}
            </span>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>

        ) : (

          <>
            <Link to="/login" className="text-gray-700 hover:text-red-500">
              Login
            </Link>

            <Link to="/register" className="text-gray-700 hover:text-red-500">
              Register
            </Link>
          </>

        )}

      </div>

    </nav>
  )
}

export default Navbar