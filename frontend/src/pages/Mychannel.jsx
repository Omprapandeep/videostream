import React, { useEffect, useState } from "react";
import api from "../services/api";
import { FaTrash, FaEdit, FaEye, FaVideo } from "react-icons/fa";

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
    <div className="p-8 max-w-6xl mx-auto">

      {/* Channel Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center text-xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {user?.username}
            </h1>

            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FaVideo className="text-gray-400" />
              {videos.length} Videos Uploaded
            </p>
          </div>
        </div>

      </div>


      {/* Videos Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        {/* Table Header */}
        <div className="grid grid-cols-4 px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-600 border-b">
          <span>Video</span>
          <span>Views</span>
          <span>Date</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Videos List */}
        {videos.map((video) => (

          <div
            key={video._id}
            className="grid grid-cols-4 items-center px-6 py-4 border-b hover:bg-gray-50 transition duration-200"
          >

            {/* Video Info */}
            <div className="flex gap-4 items-center">

              <img
                src={video.thumbnailUrl}
                alt="thumbnail"
                className="w-32 h-18 object-cover rounded-md shadow-sm"
              />

              <div className="flex flex-col">

                <span className="text-sm font-semibold text-gray-800">
                  {video.title}
                </span>


              </div>
            </div>


            {/* Views */}
            <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
              <FaEye className="text-gray-400" />
              {video.views}
            </span>


            {/* Date */}
            <span className="text-sm text-gray-500">
              {new Date(video.createdAt).toLocaleDateString()}
            </span>


            {/* Actions */}
            <div className="flex gap-2 justify-end">

              {/* Edit Button */}
              <button
                onClick={() => handleedit(video)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition cursor-pointer"
              >
                <FaEdit />
                Edit
              </button>

              {/* Delete Button */}
              <button
                onClick={() => deletevideo(video._id)}
                disabled={deletingid === video._id}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition cursor-pointer"
              >
                <FaTrash />
                {deletingid === video._id ? "Deleting..." : "Delete"}
              </button>

            </div>

          </div>
        ))}

        {/* Empty State */}
        {videos.length === 0 && (
          <div className="text-center py-16 text-gray-500">

            <FaVideo className="text-4xl mx-auto mb-3 text-gray-300" />

            <p className="text-lg font-medium">
              No videos uploaded yet
            </p>

            <p className="text-sm text-gray-400">
              Upload your first video to get started
            </p>

          </div>
        )}

      </div>

      {/* popup */}
      {showmodal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setshowmodal(false)}
          />

          {/* Modal Card */}
          <div className="relative w-100  bg-white  p-6 rounded-2xl shadow-2xl transform transition-all scale-100">

            {/* Title */}
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Edit Video
            </h2>

            {/* Input */}
            <div className="text-sm" >Title</div>
            <input
              type="text"
              value={title}
              onChange={(e) => settitle(e.target.value)}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-2 rounded-md mb-3 transition"
              placeholder="Enter title"
            />

            {/* Textarea */}
            <div  className="text-sm">Description</div>
            <textarea
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-2 rounded-md mb-4 transition"
              placeholder="Enter description"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-2">

              <button
                onClick={() => setshowmodal(false)}
                className="px-4 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleupdate}
                className="px-4 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-sm shadow-md"
              >
                Save Changes
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Mychannel;