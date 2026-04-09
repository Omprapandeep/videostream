import React, { useEffect, useState } from "react";
import api from "../services/api";
import { FaTrash, FaEdit, FaEye, FaVideo } from "react-icons/fa";
import { Link } from "react-router-dom";

const Mychannel = () => {
  const [videos, setvideos] = useState([]);
  const [deletingid, setdeletingid] = useState(null);
  const [selectedvideo, setselectedvideo] = useState(null);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [showmodal, setshowmodal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchmyvideos();
  }, []);

  const fetchmyvideos = async () => {
    try {
      const res = await api.get("/videos/myvideos");
      setvideos(res.data.videos);
    } catch (err) {
      console.log(err);
    }
  };

  const deletevideo = async (id) => {
    try {
      setdeletingid(id);
      await api.delete(`/videos/${id}`);
      setvideos((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.log(err);
    } finally {
      setdeletingid(null);
    }
  };

  const handleedit = (video) => {
    console.log(video);
    setselectedvideo(video);
    settitle(video.title);
    setdescription(video.description);
    setshowmodal(true);
  }

  const handleupdate = async () => {
    try {
      const res = await api.put(`/videos/${selectedvideo._id}`, {
        title,
        description
      });

      //state change
      setvideos(prev => prev.map(v => v._id === selectedvideo._id ? res.data : v));

      //close modal
      setshowmodal(false);
      setselectedvideo(null);
      settitle("");
      setdescription("");
    }
    catch (err) {
      console.log(err);
    }
  }

return (
  <div className="p-4 md:p-8 max-w-7xl mx-auto">

    {/* 🔥 Header */}
    <div className="flex items-center justify-between mb-8">

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-linear-to-br from-red-500 to-red-600 text-white flex items-center justify-center text-2xl font-bold shadow">
          {user?.username?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {user?.username}
          </h1>
          <p className="text-sm text-gray-500">
            {videos.length} videos uploaded
          </p>
        </div>
      </div>

    </div>

    {/* 🔥 Videos Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-9">

      {videos.map((video) => (
       
       <Link to={`/video/${video._id}` } key={video._id} >

        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-4 flex flex-col gap-3 group" >

          {/* Thumbnail */}
          <div className="relative cursor-pointer">
            <img
              src={video.thumbnailUrl}
              alt="thumbnail"
              className="w-full h-45 object-cover rounded-xl"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition rounded-xl flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition text-sm">
                View
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
            {video.title}
          </h2>

          {/* Meta */}
          <div className="flex justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <FaEye /> {video.views}
            </span>
            <span>
              {new Date(video.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-2">

            {/* Edit */}
            <button
              onClick={(e) => {e.preventDefault(); handleedit(video);}}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
            >
              <FaEdit />
              Edit
            </button>

            {/* Delete */}
            <button
              onClick={(e) => {e.preventDefault(); deletevideo(video._id);}}
              disabled={deletingid === video._id}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition cursor-pointer"
            >
              <FaTrash />
              {deletingid === video._id ? "..." : "Delete"}
            </button>

          </div>

        </div>

        </Link>
      ))}

    </div>

    {/* Empty State */}
    {videos.length === 0 && (
      <div className="text-center py-20 text-gray-500">

        <FaVideo className="text-5xl mx-auto mb-4 text-gray-300" />

        <p className="text-lg font-medium">
          No videos uploaded yet
        </p>

        <p className="text-sm text-gray-400 mt-1">
          Upload your first video 🚀
        </p>

      </div>
    )}

    {/* 🔥 Modal */}
    {showmodal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setshowmodal(false)}
        />

        <div className="relative w-full max-w-md bg-white p-6 rounded-2xl shadow-xl">

          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Edit Video
          </h2>

          <label className="text-sm text-gray-600">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => settitle(e.target.value)}
            className="w-full mt-1 mb-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 p-2.5 rounded-lg outline-none"
          />

          <label className="text-sm text-gray-600">Description</label>
          <textarea
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            className="w-full mt-1 mb-4 border border-gray-300 focus:ring-2 focus:ring-blue-500 p-2.5 rounded-lg outline-none"
          />

          <div className="flex justify-end gap-2">

            <button
              onClick={() => setshowmodal(false)}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleupdate}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm shadow transition cursor-pointer"
            >
              Save
            </button>

          </div>

        </div>
      </div>
    )}

  </div>
);
};

export default Mychannel;