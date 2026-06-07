import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  FaFilm, FaEye, FaHeart,
  FaEdit, FaLock, FaCheck, FaTimes,
  FaCalendarAlt, FaEnvelope
} from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────
   Small reusable pieces
───────────────────────────────────────── */

const Divider = () => (
  <div
    className="my-8"
    style={{ borderTop: "0.5px solid rgba(124,58,237,0.15)" }}
  />
);

const Label = ({ children }) => (
  <label className="block text-[11px] uppercase tracking-widest text-white/35 mb-1.5">
    {children}
  </label>
);

const GlassInput = ({ type = "text", ...props }) => (
  <input
    type={type}
    {...props}
    className="w-full px-3.5 py-2.5 rounded-[10px] text-[13px] text-white
      placeholder-white/20 outline-none transition-all duration-200"
    style={{
      background: "rgba(255,255,255,0.05)",
      border: "0.5px solid rgba(255,255,255,0.10)",
    }}
    onFocus={e => {
      e.target.style.border = "0.5px solid rgba(124,58,237,0.55)";
      e.target.style.background = "rgba(124,58,237,0.08)";
      e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.08)";
    }}
    onBlur={e => {
      e.target.style.border = "0.5px solid rgba(255,255,255,0.10)";
      e.target.style.background = "rgba(255,255,255,0.05)";
      e.target.style.boxShadow = "none";
    }}
  />
);

const SaveBtn = ({ onClick, loading, label }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px]
      font-medium text-white transition-all hover:opacity-85 disabled:opacity-50 cursor-pointer"
    style={{
      background: "linear-gradient(135deg, #7c3aed, #22c55e)",
      boxShadow: "0 2px 16px rgba(124,58,237,0.28)",
    }}
  >
    <FaCheck size={11} />
    {loading ? "Saving..." : label}
  </button>
);

const FeedbackMsg = ({ msg, isError }) => msg ? (
  <span className={`text-xs flex items-center gap-1.5 ${isError ? "text-red-400" : "text-green-400"}`}>
    {isError ? <FaTimes size={10} /> : <FaCheck size={10} />}
    {msg}
  </span>
) : null;

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-2.5 mb-5">
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center"
      style={{
        background: "rgba(124,58,237,0.15)",
        border: "0.5px solid rgba(124,58,237,0.30)",
      }}
    >
      <span className="text-purple-400">{icon}</span>
    </div>
    <h2 className="text-white/70 text-[11px] font-medium uppercase tracking-widest">
      {title}
    </h2>
  </div>
);

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // username
  const [username, setUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState({ text: "", error: false });

  // password
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ text: "", error: false });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      setProfile(res.data.user);
      setStats(res.data.stats);
      setUsername(res.data.user.username);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (!username.trim()) return;
    try {
      setUsernameLoading(true);
      const res = await api.put("/users/profile", { username });
      setProfile(res.data.user);
      // sync localStorage
      const stored = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem("user", JSON.stringify({ ...stored, username: res.data.user.username }));
      setUsernameMsg({ text: "Username updated!", error: false });
    } catch (err) {
      setUsernameMsg({ text: err.response?.data?.message || "Failed to update.", error: true });
    } finally {
      setUsernameLoading(false);
      setTimeout(() => setUsernameMsg({ text: "", error: false }), 3000);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdMsg({ text: "Fill all fields.", error: true });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ text: "New passwords don't match.", error: true });
      return;
    }
    if (newPwd.length < 6) {
      setPwdMsg({ text: "Password must be 6+ characters.", error: true });
      return;
    }
    try {
      setPwdLoading(true);
      await api.put("/users/profile", { currentPassword: currentPwd, newPassword: newPwd });
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
      setPwdMsg({ text: "Password changed!", error: false });
    } catch (err) {
      setPwdMsg({ text: err.response?.data?.message || "Failed.", error: true });
    } finally {
      setPwdLoading(false);
      setTimeout(() => setPwdMsg({ text: "", error: false }), 3000);
    }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin"
        />
        <p className="text-white/25 text-sm">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">


      {/* ── Hero Banner ── */}
      <div
        className="h-30 w-full relative overflow-hidden"
        style={{ borderBottom: "0.5px solid rgba(124,58,237,0.20)" }}
      >
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 40%, #0d1f0d 100%)",
          }}
        />

        {/* Animated orbs */}
        <div
          className="absolute w-64 h-64 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
            top: "-80px",
            left: "-40px",
            animation: "orb1 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-48 h-48 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #22c55e 0%, transparent 70%)",
            top: "-60px",
            right: "10%",
            animation: "orb2 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-40 h-40 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
            bottom: "-60px",
            left: "40%",
            animation: "orb3 10s ease-in-out infinite",
          }}
        />

        {/* Scanline texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
          }}
        />

        {/* Bottom fade into page */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12"
          style={{
            background: "linear-gradient(to bottom, transparent, #0a0a0f)",
          }}
        />

        {/* Vibe watermark text */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 text-[80px] font-black select-none pointer-events-none"
          style={{
            color: "rgba(124,58,237,0.08)",
            WebkitTextStroke: "1px rgba(124,58,237,0.12)",
            letterSpacing: "-4px",
          }}
        >
          VIBE
        </div>

      </div>

      <div className="max-w-3xl mx-auto z-100 px-4 md:px-6">

        {/* ── Avatar row (overlaps banner) ── */}
        <div className="flex items-end justify-between  -mt-10 mb-6">
          <div
            className="w-20 z-50 h-20 rounded-2xl flex items-center justify-center
              text-3xl font-bold text-white shrink-0 ring-4"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #22c55e)",
              boxShadow: "0 0 40px rgba(124,58,237,0.40)",
              ringColor: "#0a0a0f",
              outline: "4px solid #0a0a0f",
            }}
          >
            {profile?.username?.charAt(0).toUpperCase()}
          </div>

          {/* Upload shortcut */}
          <Link
            to="/upload"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px]
              font-medium text-white transition-all hover:opacity-85 mb-1"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "0 2px 16px rgba(34,197,94,0.25)",
            }}
          >
            <FiUpload size={13} />
            Upload
          </Link>
        </div>

        {/* ── Name + meta ── */}
        <div className="mb-6">
          <h1 className="text-white text-2xl font-semibold tracking-tight">
            {profile?.username}
          </h1>
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
            <span className="flex items-center gap-1.5 text-white/35 text-[12px]">
              <FaEnvelope size={10} />
              {profile?.email}
            </span>
            <span className="flex items-center gap-1.5 text-white/35 text-[12px]">
              <FaCalendarAlt size={10} />
              Joined {new Date(profile?.createdAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </span>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3 mb-2">
          {[
            { icon: <FaFilm size={15} />, label: "Videos", value: stats?.totalvideos ?? 0 },
            { icon: <FaEye size={15} />, label: "Total Views", value: stats?.totalViews ?? 0 },
            { icon: <FaHeart size={15} />, label: "Total Likes", value: stats?.totalLikes ?? 0 },
          ].map(s => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center py-4 rounded-2xl gap-1.5 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(124,58,237,0.15)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)";
                e.currentTarget.style.background = "rgba(124,58,237,0.07)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.15)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <span className="text-purple-400">{s.icon}</span>
              <span className="text-white text-xl font-semibold">{s.value.toLocaleString()}</span>
              <span className="text-white/30 text-[11px]">{s.label}</span>
            </div>
          ))}
        </div>

        <Divider />

        {/* ── Edit Username ── */}
        <div className="mb-2">
          <SectionHeader icon={<FaEdit size={12} />} title="Edit Username" />
          <div className="flex flex-col gap-3">
            <div>
              <Label>New Username</Label>
              <GlassInput
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter new username"
                onKeyDown={e => { if (e.key === "Enter") handleUsernameUpdate(); }}
              />
            </div>
            <div className="flex items-center gap-3">
              <SaveBtn
                onClick={handleUsernameUpdate}
                loading={usernameLoading}
                label="Save Username"
              />
              <FeedbackMsg msg={usernameMsg.text} isError={usernameMsg.error} />
            </div>
          </div>
        </div>

        <Divider />

        {/* ── Change Password ── */}
        <div className="mb-10">
          <SectionHeader icon={<FaLock size={12} />} title="Change Password" />
          <div className="flex flex-col gap-3">

            <div>
              <Label>Current Password</Label>
              <GlassInput
                type="password"
                value={currentPwd}
                onChange={e => setCurrentPwd(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>New Password</Label>
                <GlassInput
                  type="password"
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                  placeholder="New password"
                />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <GlassInput
                  type="password"
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  placeholder="Confirm password"
                  onKeyDown={e => { if (e.key === "Enter") handlePasswordUpdate(); }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <SaveBtn
                onClick={handlePasswordUpdate}
                loading={pwdLoading}
                label="Change Password"
              />
              <FeedbackMsg msg={pwdMsg.text} isError={pwdMsg.error} />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default MyProfile;