import React, { useEffect, useState } from "react";
import api from "../services/api";
import { FaTrash, FaEdit, FaEye, FaVideo } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Mychannel = () => {
  const { user, loading: authLoading } = useAuth();
  const [videos, setvideos] = useState([]);
  const [subscribers, setsubscribers] = useState(0);
  const [deletingid, setdeletingid] = useState(null);
  const [selectedvideo, setselectedvideo] = useState(null);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [showmodal, setshowmodal] = useState(false);
  const [confirmdelete, setconfirmdelete] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      fetchmyvideos();
      if (user?._id) fetchSubscribers();
    }
  }, [user, authLoading]);

  const fetchSubscribers = async () => {
    try {
      const res = await api.get(`/subscriptions/subscribers/${user._id}`);
      setsubscribers(res.data.subscribers);
    } catch (err) {
      console.log(err);
    }
  };

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



  if (authLoading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
        <p className="text-white/25 text-sm">Loading channel...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-[#0a0a0f] px-4 py-6 md:px-8 max-w-7xl mx-auto ">

      {/* 🔥 Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">

          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed, #22c55e)", boxShadow: "0 0 24px rgba(124,58,237,0.35)" }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-white text-xl font-semibold">{user?.username}</h1>
            <p className="text-white/40 text-sm mt-0.5">{subscribers} subscribers • {videos.length} videos uploaded</p>
          </div>
        </div>

        <Link
          to="/upload"
          className="flex items-center gap-2 py-2 px-4 rounded-xl text-[13px] font-medium text-white transition-al hover:opacity-85 "
          style={{
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            boxShadow: "0 2px 16px rgba(34,197,94,0.28)",
          }}
        >
          <FaVideo size={13} />
          Upload Video
        </Link>
      </div>

      {/* divider */}

      <div style={{ borderTop: "0.5px solid rgba(124,58,237,0.15)" }} className="mb-8" />

      {/* 🔥 Videos Grid */}

      {/* ── Videos grid ── */}
      {videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {videos.map(video => (
            <Link to={`/video/${video._id}`} key={video._id} className="block no-underline group">
              <div
                className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "0.5px solid rgba(124,58,237,0.15)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(124,58,237,0.38)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(124,58,237,0.15)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(124,58,237,0.15)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
                }}
              >

                {/* Thumbnail */}
                <div className="relative overflow-hidden bg-black">
                  <img
                    src={video.thumbnailUrl}
                    alt="thumbnail"
                    className="w-full h-44 object-cover transition-transform duration-500  will-change-transform"
                  />
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }}
                  />
                  {/* Views badge */}
                  <div
                    className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] text-white/90"
                    style={{ background: "rgba(0,0,0,0.60)", border: "0.5px solid rgba(255,255,255,0.10)" }}
                  >
                    <FaEye size={10} />
                    {video.views}
                  </div>
                  {/* Date badge */}
                  <div
                    className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[11px] text-white/70"
                    style={{ background: "rgba(0,0,0,0.60)", border: "0.5px solid rgba(255,255,255,0.10)" }}
                  >
                    {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col gap-3">
                  <h2 className="text-white/90 text-sm font-medium leading-snug line-clamp-2">
                    {video.title}
                  </h2>

                  {/* Actions */}
                  <div className="flex gap-2">

                    {/* Edit */}
                    <button
                      onClick={e => { e.preventDefault(); handleedit(video); }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-150"
                      style={{
                        background: "rgba(124,58,237,0.12)",
                        border: "0.5px solid rgba(124,58,237,0.25)",
                        color: "#c4b5fd",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.22)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(124,58,237,0.12)"}
                    >
                      <FaEdit size={12} />
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={e => { e.preventDefault(); setconfirmdelete(video); }}
                      disabled={deletingid === video._id}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-150 disabled:opacity-50"
                      style={{
                        background: "rgba(248,113,113,0.08)",
                        border: "0.5px solid rgba(248,113,113,0.22)",
                        color: "#f87171",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.18)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
                    >
                      <FaTrash size={12} />
                      {deletingid === video._id ? "..." : "Delete"}
                    </button>

                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {videos.length === 0 && (

        <div className="flex flex-col items-center justify-center py-28 gap-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(124,58,,237,0.17)",
              border: "0.5px solid rgba(124,58,237,0.22)",
            }}>

            <FaVideo size={32} color="#a78bfa" />
          </div>

          <p className="text-white/60 text-[15px] font-medium "> No videos uploaded yet</p>
          <p className="text-white/30 text-[13px]"> Upload your first video </p>
          <Link to="/upload"
            className="mt-2 px-6 py-2.5 rounded-xl text-[13px] font-medium text-white transition-all hover:opacity-85"
            style={{
              background: "linear-gradient(135deg,#7c3aed, #22c55e)",
              boxShadow: "0 2px 16px rgba(124,58,237,0.30)",
            }}>

            Upload Video
          </Link>

        </div>

      )}

      {/* 🔥 Modal */}
      {showmodal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            onClick={() => setshowmodal(false)}
          />

          {/* Modal card */}
          <div
            className="relative w-full max-w-md p-6 rounded-2xl flex flex-col gap-4"
            style={{
              background: "rgba(15,10,30,0.95)",
              border: "0.5px solid rgba(124,58,237,0.30)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(124,58,237,0.10)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-white text-lg font-semibold">Edit Video</h2>
              <button
                onClick={() => setshowmodal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all text-white/40 hover:text-white"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                ✕
              </button>
            </div>

            {/* Title input */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => settitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[10px] text-[14px] text-white placeholder-white/20 outline-none transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)" }}
                onFocus={e => e.target.style.border = "0.5px solid rgba(124,58,237,0.55)"}
                onBlur={e => e.target.style.border = "0.5px solid rgba(255,255,255,0.12)"}
              />
            </div>

            {/* Description input */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setdescription(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-[10px] text-[14px] text-white placeholder-white/20 outline-none transition-all duration-200 resize-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)" }}
                onFocus={e => e.target.style.border = "0.5px solid rgba(124,58,237,0.55)"}
                onBlur={e => e.target.style.border = "0.5px solid rgba(255,255,255,0.12)"}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-1">
              <button
                onClick={() => setshowmodal(false)}
                className="px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.55)",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              >
                Cancel
              </button>
              <button
                onClick={handleupdate}
                className="px-4 py-2 rounded-xl text-[13px] font-medium text-white cursor-pointer transition-all hover:opacity-85"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #22c55e)",
                  boxShadow: "0 2px 16px rgba(124,58,237,0.30)",
                }}
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔥 Delete Confirm Modal */}
      {confirmdelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            onClick={() => setconfirmdelete(null)}
          />

          {/* Modal card */}
          <div
            className="relative w-full max-w-sm p-6 rounded-2xl flex flex-col gap-4"
            style={{
              background: "rgba(15,10,30,0.95)",
              border: "0.5px solid rgba(248,113,113,0.30)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(248,113,113,0.10)",
            }}
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-xl mx-auto"
              style={{ background: "rgba(248,113,113,0.10)", border: "0.5px solid rgba(248,113,113,0.25)" }}>
              <FaTrash size={18} color="#f87171" />
            </div>

            {/* Text */}
            <div className="text-center">
              <h2 className="text-white text-base font-semibold mb-1">Delete Video?</h2>
              <p className="text-white/40 text-[13px] leading-relaxed">
                <span className="text-white/60 font-medium">"{confirmdelete.title}"</span> will be permanently removed. This cannot be undone.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setconfirmdelete(null)}
                className="flex-1 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.55)",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deletevideo(confirmdelete._id);
                  setconfirmdelete(null);
                }}
                disabled={deletingid === confirmdelete._id}
                className="flex-1 py-2 rounded-xl text-[13px] font-medium text-white cursor-pointer transition-all hover:opacity-85 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #dc2626, #f87171)",
                  boxShadow: "0 2px 16px rgba(248,113,113,0.28)",
                }}
              >
                {deletingid === confirmdelete._id? "Deleting..." : "Yes, Delete"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Mychannel;