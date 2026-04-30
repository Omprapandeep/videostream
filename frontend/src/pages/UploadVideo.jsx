import React, { useState,useMemo } from 'react'
import api from '../services/api'

const UploadVideo = () => {
  // ── All state unchanged ──
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoFile, setVideoFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const videoPreviewUrl = useMemo(() => {
  return videoFile ? URL.createObjectURL(videoFile) : null
}, [videoFile])

  // ── All handlers unchanged ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!videoFile) { setError("Please select a video file"); return }
    if (!title.trim()) { setError("Please enter a title"); return }
    setError("")
    setLoading(true)
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("video", videoFile)
    try {
      await api.post("/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setProgress(percent)
        },
      })
      setSuccess(true)
    } catch (err) {
      console.log(err)
      setError("Upload failed. Please try again.")
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true) }
  const handleDragLeave = (e) => { e.preventDefault(); setDragActive(false) }
  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
      setError("")
    } else {
      setError("Please drop a valid video file")
    }
  }

  const removeFile = (e) => {
    e.stopPropagation()
    setVideoFile(null)
    setSuccess(false)
  }

  // ── Success state unchanged ──
  if (success) return (
    <div className="h-[calc(100vh-66.9px)] bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[#ff2d55] opacity-[0.06] rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <svg viewBox="0 0 24 24" width={36} height={36} fill="none" stroke="#34d399" strokeWidth={2}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-white text-2xl font-semibold mb-2">Video Uploaded!</h2>
        <p className="text-white/40 text-sm mb-8">Your video is now live on VideoTube</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setSuccess(false); setTitle(""); setDescription(""); setVideoFile(null) }}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white bg-[#ff2d55] hover:bg-[#e0253d] transition-all"
            style={{ boxShadow: "0 4px 20px rgba(255,45,85,0.3)" }}
          >Upload Another</button>
          <button
            onClick={() => window.location.href = "/"}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white/60 hover:text-white transition-colors"
            style={{ border: "0.5px solid rgba(255,255,255,0.12)" }}
          >Go Home</button>
        </div>
      </div>
    </div>
  )

  // ── CHANGE 1: was `min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden`
  //             now `h-screen flex overflow-hidden relative`  (two-column, no scroll) ──
  return (
    <div className="h-[calc(100vh-66.9px)] bg-[#0a0a0f] flex overflow-hidden relative">

      {/* Background glows — unchanged */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-125  h-100 bg-[#ff2d55] opacity-[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-100 h-100 bg-purple-700 opacity-[0.07] rounded-full blur-[100px]" />
      </div>

      {/* Grid — unchanged */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── CHANGE 2: NEW left panel — brand / hero side ── */}
      <div
        className="relative z-10 w-[42%] shrink-0 flex flex-col justify-between px-12 py-10 overflow-hidden"
      
      >
        {/* Logo (moved from your old header block) */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8.5 h-8.5 rounded-[9px] bg-[#ff2d55] flex items-center justify-center shrink-0"
            style={{ boxShadow: "0 0 18px rgba(255,45,85,0.5)" }}
          >
            <svg viewBox="0 0 24 24" width={13} height={13} fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
          <span className="text-white text-[18px] font-bold tracking-tight">
            Video<span className="text-[#ff2d55]">Tube</span>
          </span>
        </div>

        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-[11px] text-[#ff2d55] font-medium uppercase tracking-widest"
            style={{ background: "rgba(255,45,85,0.10)", border: "0.5px solid rgba(255,45,85,0.25)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d55] inline-block" />
            Creator Studio
          </div>
          <h1 className="text-white font-semibold tracking-tight mb-4 leading-[1.15]"
            style={{ fontSize: "clamp(28px, 3vw, 42px)" }}
          >
            Share your<br />
            <span className="text-[#ff2d55]">story</span> with<br />
            the world.
          </h1>
          <p className="text-white/35 text-[13px] leading-relaxed max-w-65">
            Upload your video and reach millions of viewers instantly on VideoTube.
          </p>
          <div className="flex gap-6 mt-8">
            {[["2M+", "Creators"], ["500M", "Views/day"], ["190+", "Countries"]].map(([val, label]) => (
              <div key={label}>
                <div className="text-white font-semibold text-[18px] leading-none">{val}</div>
                <div className="text-white/30 text-[11px] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-[11px]">© 2025 VideoTube · All rights reserved</p>
      </div>

      {/* ── CHANGE 3: right panel wraps your existing header + form — nothing inside changed ── */}
      <div className=" relative z-10 flex-1 flex justify-end px-20  overflow-y-auto">
        <div className="w-full max-w-xl pt-3 ">



          {/* Your original form — 100% unchanged */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-6 sm:p-8 space-y-5"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "0.5px solid rgba(255,255,255,0.10)",
              boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
            }}
          >
            {error && (
              <div
                className="px-4 py-2.5 rounded-lg text-[13px] text-[#ff6b84]"
                style={{ background: "rgba(255,45,85,0.12)", border: "0.5px solid rgba(255,45,85,0.3)" }}
              >
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5">
                Title <span className="text-[#ff2d55]">*</span>
              </label>
              <input
                type="text"
                placeholder="Give your video a great title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-3 rounded-[10px] text-[14px] text-white placeholder-white/20 outline-none transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)" }}
                onFocus={e => (e.target.style.border = "0.5px solid rgba(255,45,85,0.5)")}
                onBlur={e => (e.target.style.border = "0.5px solid rgba(255,255,255,0.12)")}
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Tell viewers about your video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-3 rounded-[10px] text-[14px] text-white placeholder-white/20 outline-none transition-all duration-200 resize-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)" }}
                onFocus={e => (e.target.style.border = "0.5px solid rgba(255,45,85,0.5)")}
                onBlur={e => (e.target.style.border = "0.5px solid rgba(255,255,255,0.12)")}
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5">
                Video File <span className="text-[#ff2d55]">*</span>
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !videoFile && document.getElementById("fileInput").click()}
                className="relative rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
                style={{
                  border: dragActive ? "1.5px dashed rgba(255,45,85,0.6)" : videoFile ? "0.5px solid rgba(255,255,255,0.12)" : "1.5px dashed rgba(255,255,255,0.12)",
                  background: dragActive ? "rgba(255,45,85,0.06)" : "rgba(255,255,255,0.03)",
                }}
              >
                {videoFile ? (
                  <div className="p-3">
                    <video
                      src={videoPreviewUrl}
                      controls
                      onClick={(e) => e.stopPropagation()}
                      className="w-full max-h-56 object-contain rounded-lg"
                      style={{ background: "#000" }}
                    />
                    <div className="flex items-center justify-between mt-3 px-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[#ff2d55]/10 flex items-center justify-center shrink-0">
                          <svg viewBox="0 0 24 24" width={14} height={14} fill="#ff2d55">
                            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V4h-4z"/>
                          </svg>
                        </div>
                        <p className="text-[12px] text-white/50 truncate">{videoFile.name}</p>
                      </div>
                      <button onClick={removeFile} className="shrink-0 ml-3 text-white/30 hover:text-[#ff2d55] transition-colors text-[11px] font-medium">
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                      style={{ background: "rgba(255,45,85,0.10)", border: "0.5px solid rgba(255,45,85,0.2)" }}
                    >
                      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="#ff2d55" strokeWidth={1.5}>
                        <polyline points="16 16 12 12 8 16" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
                      </svg>
                    </div>
                    <p className="text-white/70 text-[14px] font-medium mb-1">Drop your video here</p>
                    <p className="text-white/30 text-[12px]">
                      or <span className="text-[#ff2d55]">click to browse</span> · MP4, MOV, AVI up to 2GB
                    </p>
                  </div>
                )}
              </div>
              <input
                id="fileInput"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => { setVideoFile(e.target.files[0]); setError("") }}
              />
            </div>
            

            {loading && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] text-white/40 uppercase tracking-widest">Uploading</span>
                  <span className="text-[11px] text-[#ff2d55] font-medium">{progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%`, background: "linear-gradient(90deg, #ff2d55, #ff6b8a)", boxShadow: "0 0 10px rgba(255,45,85,0.5)" }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
            className="w-full py-3 rounded-[10px] text-[14px] font-medium text-white transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: loading ? "rgba(255,255,255,0.08)" : "#ff2d55", boxShadow: loading ? "none" : "0 4px 20px rgba(255,45,85,0.35)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" viewBox="0 0 24 24" width={16} height={16} fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Uploading {progress}%
                </span>
              ) : "Upload Video"}
            </button>

          </form>
        </div>
      </div>

    </div>
  )
}

export default UploadVideo