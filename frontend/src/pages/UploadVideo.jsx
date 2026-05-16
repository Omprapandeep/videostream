import React, { useState, useMemo } from 'react'
import api from '../services/api'
import logo from "../assets/appreal.png"

const UploadVideo = () => {
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

  // ── Success state ──
  if (success) return (
    <div className="min-h-[calc(100vh-66.9px)] bg-[#0a0a0f] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[#7c3aed] opacity-[0.08] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#22c55e] opacity-[0.06] rounded-full blur-[100px]" />
      </div>
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }} />
      <div className="relative z-10 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <svg viewBox="0 0 24 24" width={36} height={36} fill="none" stroke="#34d399" strokeWidth={2}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-white text-2xl font-semibold mb-2">Video Uploaded!</h2>
        <p className="text-white/40 text-sm mb-8">Your video is now live on Vibe</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { setSuccess(false); setTitle(""); setDescription(""); setVideoFile(null) }}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-85"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "0 4px 20px rgba(34,197,94,0.30)",
            }}
          >
            Upload Another
          </button>
          <button
            onClick={() => window.location.href = "/"}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white/60 hover:text-white transition-colors"
            style={{ border: "0.5px solid rgba(255,255,255,0.12)" }}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )

  return (
    /*
      Mobile/tablet  → single-column, scrollable, centered form
      lg+            → two-column split layout, no outer scroll (right panel scrolls internally)
    */
    <div className="min-h-[calc(100vh-66.9px)] lg:h-[calc(100vh-66.9px)] bg-[#0a0a0f] flex lg:overflow-hidden relative">

      {/* Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-125 h-100 bg-[#16a34a] opacity-[0.09] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-100 h-100 bg-[#7c3aed] opacity-[0.09] rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-[#06b6d4] opacity-[0.06] rounded-full blur-[90px]" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }} />

      {/* ── Left panel — hidden on mobile/tablet ── */}
      <div className="relative z-10 w-[42%] shrink-0 flex-col justify-between px-12 py-10 overflow-hidden hidden lg:flex">

        <img src={logo} alt="Vibe" className="h-15 w-30" />

        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-[11px] font-medium uppercase tracking-widest text-purple-400"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "0.5px solid rgba(124,58,237,0.28)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
            Creator Studio
          </div>

          <h1
            className="text-white font-semibold tracking-tight mb-4 leading-[1.15]"
            style={{ fontSize: "clamp(28px, 3vw, 42px)" }}
          >
            Share your<br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #22c55e, #a78bfa)" }}
            >
              story
            </span> with<br />
            the world.
          </h1>

          <p className="text-white/35 text-[13px] leading-relaxed max-w-xs">
            Upload your video and reach millions of viewers instantly on Vibe.
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

        <p className="text-white/20 text-[11px]">© 2025 Vibe · All rights reserved</p>
      </div>

      {/* ── Right panel: form ── */}
      {/*
        Mobile:  full-width, centered, normal vertical padding, scrolls with page
        Tablet:  same but slightly more side padding
        lg+:     flex-1, right-aligned, internal scroll only
      */}
      <div className="relative z-10 flex-1 flex justify-center lg:justify-end items-start px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 overflow-y-auto w-full">
        <div className="w-full max-w-xl pt-6 lg:pt-3">

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-5 sm:p-5 space-y-4"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "0.5px solid rgba(255,255,255,0.10)",
              boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
            }}
          >

            {/* Mobile logo + heading — hidden on lg where left panel is visible */}
            <div className="flex items-center gap-3 mb-1 lg:hidden">
              <img src={logo} alt="Vibe" className="h-8 w-auto" />
            </div>

            <div className="mb-1">
              <h2 className="text-[#A855F7] text-[20px] font-semibold tracking-tight">Upload a video</h2>
              <p className="text-white/35 text-[13px] mt-0.5">Fill in the details and drop your file</p>
            </div>

            {/* Error */}
            {error && (
              <div
                className="px-4 py-2.5 rounded-lg text-[13px] text-red-400"
                style={{
                  background: "rgba(248,113,113,0.10)",
                  border: "0.5px solid rgba(248,113,113,0.25)",
                }}
              >
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5">
                Title <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Give your video a great title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-3 rounded-[10px] text-[14px] text-white placeholder-white/20 outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                }}
                onFocus={e => (e.target.style.border = "0.5px solid rgba(124,58,237,0.55)")}
                onBlur={e => (e.target.style.border = "0.5px solid rgba(255,255,255,0.12)")}
              />
            </div>

            {/* Description */}
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
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                }}
                onFocus={e => (e.target.style.border = "0.5px solid rgba(124,58,237,0.55)")}
                onBlur={e => (e.target.style.border = "0.5px solid rgba(255,255,255,0.12)")}
              />
            </div>

            {/* Video file drop zone */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5">
                Video File <span className="text-purple-400">*</span>
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !videoFile && document.getElementById("fileInput").click()}
                className="relative rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
                style={{
                  border: dragActive
                    ? "1.5px dashed rgba(124,58,237,0.65)"
                    : videoFile
                      ? "0.5px solid rgba(255,255,255,0.12)"
                      : "1.5px dashed rgba(255,255,255,0.12)",
                  background: dragActive ? "rgba(124,58,237,0.07)" : "rgba(255,255,255,0.03)",
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
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "rgba(124,58,237,0.12)" }}
                        >
                          <svg viewBox="0 0 24 24" width={14} height={14} fill="#a78bfa">
                            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V4h-4z" />
                          </svg>
                        </div>
                        <p className="text-[12px] text-white/50 truncate">{videoFile.name}</p>
                      </div>
                      <button
                        onClick={removeFile}
                        className="shrink-0 ml-3 text-white/30 hover:text-red-400 transition-colors text-[11px] font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 sm:py-12 px-6 text-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                      style={{
                        background: "rgba(124,58,237,0.10)",
                        border: "0.5px solid rgba(124,58,237,0.22)",
                      }}
                    >
                      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="#a78bfa" strokeWidth={1.5}>
                        <polyline points="16 16 12 12 8 16" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
                      </svg>
                    </div>
                    <p className="text-white/70 text-[14px] font-medium mb-1">Drop your video here</p>
                    <p className="text-white/30 text-[12px]">
                      or <span className="text-purple-400">click to browse</span> · MP4, MOV, AVI up to 2GB
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

            {/* Progress bar */}
            {loading && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] text-white/40 uppercase tracking-widest">Uploading</span>
                  <span className="text-[11px] text-purple-400 font-medium">{progress}%</span>
                </div>
                <div
                  className="w-full h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, #7c3aed, #22c55e)",
                      boxShadow: "0 0 10px rgba(124,58,237,0.45)",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-[10px] text-[14px] font-medium text-white transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: loading
                  ? "rgba(255,255,255,0.08)"
                  : "linear-gradient(135deg, #22c55e, #7c3aed)",
                boxShadow: loading ? "none" : "0 4px 20px rgba(124,58,237,0.35)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" viewBox="0 0 24 24" width={16} height={16} fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Uploading {progress}%
                </span>
              ) : "Upload Video"}
            </button>

          </form>

          {/* Mobile footer */}
          <p className="text-white/20 text-[11px] text-center mt-6 lg:hidden">© 2025 Vibe · All rights reserved</p>
        </div>
      </div>

    </div>
  )
}

export default UploadVideo



// import React, { useState, useMemo } from 'react'
// import api from '../services/api'
// import logo from "../assets/appreal.png";

// const UploadVideo = () => {
//   // ── All state unchanged ──
//   const [title, setTitle] = useState("")
//   const [description, setDescription] = useState("")
//   const [videoFile, setVideoFile] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [dragActive, setDragActive] = useState(false)
//   const [success, setSuccess] = useState(false)
//   const [error, setError] = useState("")

//   const videoPreviewUrl = useMemo(() => {
//     return videoFile ? URL.createObjectURL(videoFile) : null
//   }, [videoFile])


//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!videoFile) { setError("Please select a video file"); return }
//     if (!title.trim()) { setError("Please enter a title"); return }
//     setError("")
//     setLoading(true)
//     const formData = new FormData()
//     formData.append("title", title)
//     formData.append("description", description)
//     formData.append("video", videoFile)
//     try {
//       await api.post("/videos/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//         onUploadProgress: (progressEvent) => {
//           const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
//           setProgress(percent)
//         },
//       })
//       setSuccess(true)
//     } catch (err) {
//       console.log(err)
//       setError("Upload failed. Please try again.")
//     } finally {
//       setLoading(false)
//       setProgress(0)
//     }
//   }

//   const handleDragOver = (e) => { e.preventDefault(); setDragActive(true) }
//   const handleDragLeave = (e) => { e.preventDefault(); setDragActive(false) }
//   const handleDrop = (e) => {
//     e.preventDefault()
//     setDragActive(false)
//     const file = e.dataTransfer.files[0]
//     if (file && file.type.startsWith("video/")) {
//       setVideoFile(file)
//       setError("")
//     } else {
//       setError("Please drop a valid video file")
//     }
//   }

//   const removeFile = (e) => {
//     e.stopPropagation()
//     setVideoFile(null)
//     setSuccess(false)
//   }

//   // ── Success state  ──
//   if (success) return (
//     <div className="h-[calc(100vh-66.9px)] bg-[#0a0a0f] flex items-center justify-center px-4">
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150  bg-[#7c3aed] opacity-[0.08] rounded-full blur-[120px]" />
//       </div>
//       <div className="relative z-10 text-center">
//         <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
//           <svg viewBox="0 0 24 24" width={36} height={36} fill="none" stroke="#34d399" strokeWidth={2}>
//             <polyline points="20 6 9 17 4 12" />
//           </svg>
//         </div>
//         <h2 className="text-white text-2xl font-semibold mb-2">Video Uploaded!</h2>
//         <p className="text-white/40 text-sm mb-8">Your video is now live on VideoTube</p>
//         <div className="flex gap-3 justify-center">
//           <button
//             onClick={() => { setSuccess(false); setTitle(""); setDescription(""); setVideoFile(null) }}
//             className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-85"
//             style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", boxShadow: "0 4px 20px rgba(34,197,94,0.30)" }}
//           > Upload Another</button>
//           <button
//             onClick={() => window.location.href = "/"}
//             className="px-6 py-2.5 rounded-full text-sm font-medium text-white/60 hover:text-white transition-colors"
//             style={{ border: "0.5px solid rgba(255,255,255,0.12)" }}
//           >Go Home</button>
//         </div>
//       </div>
//     </div >
//   )

//   // ── CHANGE 1: was `min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden`
//   //             now `h-screen flex overflow-hidden relative`  (two-column, no scroll) ──
//   return (
//     <div className="h-[calc(100vh-66.9px)] bg-[#0a0a0f] flex overflow-hidden relative">

//       {/* Background glows — unchanged */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-1/4 left-1/3 w-125 h-100 bg-[#16a34a] opacity-[0.09] rounded-full blur-[120px]" />
//         <div className="absolute bottom-1/4 right-1/4 w-100 h-100 bg-[#7c3aed] opacity-[0.09] rounded-full blur-[100px]" />
//         <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-[#06b6d4] opacity-[0.06] rounded-full blur-[90px]" />
//       </div>

//       {/* Grid — unchanged */}
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
//           backgroundSize: "48px 48px",
//         }}
//       />

//       {/* ── CHANGE 2: NEW left panel — brand / hero side ── */}

//       <div className="relative z-10 w-[42%] shrink-0 flex-col justify-between px-12 py-10 overflow-hidden hidden lg:flex">

//         {/* Real logo */}
//         <div className="flex items-center gap-2.5">
//           <img src={logo} alt="Vibe" className="h-15 w-30" />
//         </div>

//         <div>
//           {/* Badge — FROM: bg-[#ff2d55] red. TO: purple-green */}
//           <div
//             className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-[11px] font-medium uppercase tracking-widest"
//             style={{
//               color: "#a78bfa",
//               background: "rgba(124,58,237,0.12)",
//               border: "0.5px solid rgba(124,58,237,0.28)",
//             }}
//           >
//             <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
//             Creator Studio
//           </div>

//           {/* Heading — FROM: text-[#ff2d55] accent. TO: green accent */}
//           <h1
//             className="text-white font-semibold tracking-tight mb-4 leading-[1.15]"
//             style={{ fontSize: "clamp(28px, 3vw, 42px)" }}
//           >
//             Share your<br />
//             <span className="text-transparent bg-clip-text"
//               style={{ backgroundImage: "linear-gradient(135deg, #22c55e, #a78bfa)" }}>
//               story
//             </span> with<br />
//             the world.
//           </h1>

//           <p className="text-white/35 text-[13px] leading-relaxed max-w-xs">
//             Upload your video and reach millions of viewers instantly on Vibe.
//           </p>

//           {/* Stats */}
//           <div className="flex gap-6 mt-8">
//             {[["2M+", "Creators"], ["500M", "Views/day"], ["190+", "Countries"]].map(([val, label]) => (
//               <div key={label}>
//                 <div className="text-white font-semibold text-[18px] leading-none">{val}</div>
//                 <div className="text-white/30 text-[11px] mt-1">{label}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <p className="text-white/20 text-[11px]">© 2025 Vibe · All rights reserved</p>
//       </div>

//       {/* ── CHANGE 3: right panel wraps your existing header + form — nothing inside changed ── */}
//       <div className=" relative z-10 flex-1 flex justify-end px-20  overflow-y-auto">
//         <div className="w-full max-w-xl pt-3 ">



//           {/* Your original form — 100% unchanged */}
//           <form
//             onSubmit={handleSubmit}
//             className="rounded-2xl p-6 sm:p-8 space-y-5"
//             style={{
//               background: "rgba(255,255,255,0.04)",
//               backdropFilter: "blur(24px)",
//               WebkitBackdropFilter: "blur(24px)",
//               border: "0.5px solid rgba(255,255,255,0.10)",
//               boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
//             }}
//           >
//             {error && (
//               <div
//                 className="px-4 py-2.5 rounded-lg text-[13px] text-red-400"
//                 style={{ background: "rgba(248,113,113,0.10)", border: "0.5px solid rgba(248,113,113,0.25)" }}
//               >
//                 {error}
//               </div>
//             )}

//             <div>
//               <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5">
//                 Title <span className="text-[#ff2d55]">*</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Give your video a great title..."
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full px-3.5 py-3 rounded-[10px] text-[14px] text-white placeholder-white/20 outline-none transition-all duration-200"
//                 style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)" }}
//                 onFocus={e => (e.target.style.border = "0.5px solid rgba(124,58,237,0.55)")}
//                 onBlur={e => (e.target.style.border = "0.5px solid rgba(255,255,255,0.12)")}
//               />
//             </div>

//             <div>
//               <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5">
//                 Description
//               </label>
//               <textarea
//                 rows={3}
//                 placeholder="Tell viewers about your video..."
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="w-full px-3.5 py-3 rounded-[10px] text-[14px] text-white placeholder-white/20 outline-none transition-all duration-200 resize-none"
//                 style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)" }}
//                 onFocus={e => (e.target.style.border = "0.5px solid rgba(124,58,237,0.55)")}
//                 onBlur={e => (e.target.style.border = "0.5px solid rgba(255,255,255,0.12)")}
//               />
//             </div>

//             <div>
//               <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5">
//                 Video File <span className="text-[#a78bfa]">*</span>
//               </label>
//               <div
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//                 onClick={() => !videoFile && document.getElementById("fileInput").click()}
//                 className="relative rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
//                 style={{
//                   border: dragActive ? "1.5px dashed rgba(124,58,237,0.60)" : videoFile ? "0.5px solid rgba(255,255,255,0.12)" : "1.5px dashed rgba(255,255,255,0.12)",
//                   background: dragActive ? "rgba(124,58,237,0.07)" : "rgba(255,255,255,0.03)",
//                 }}
//               >
//                 {videoFile ? (
//                   <div className="p-3">
//                     <video
//                       src={videoPreviewUrl}
//                       controls
//                       onClick={(e) => e.stopPropagation()}
//                       className="w-full max-h-56 object-contain rounded-lg"
//                       style={{ background: "#000" }}
//                     />
//                     <div className="flex items-center justify-between mt-3 px-1">
//                       <div className="flex items-center gap-2 min-w-0">
//                         <div className="w-7 h-7 rounded-lg  flex items-center justify-center shrink-0" style={{ background: "rgba(124,58,237,0.12)" }}>
//                           <svg viewBox="0 0 24 24" width={14} height={14} fill="#a78bfa">
//                             <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V4h-4z" />
//                           </svg>
//                         </div>
//                         <p className="text-[12px] text-white/50 truncate">{videoFile.name}</p>
//                       </div>
//                       <button onClick={removeFile} className="shrink-0 ml-3 text-white/30 hover:text-[#ff2d55] transition-colors text-[11px] font-medium">
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
//                     <div
//                       className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
//                       style={{ background: "rgba(255,45,85,0.10)", border: "0.5px solid rgba(255,45,85,0.2)" }}
//                     >
//                       <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="#ff2d55" strokeWidth={1.5}>
//                         <polyline points="16 16 12 12 8 16" />
//                         <line x1="12" y1="12" x2="12" y2="21" />
//                         <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
//                       </svg>
//                     </div>
//                     <p className="text-white/70 text-[14px] font-medium mb-1">Drop your video here</p>
//                     <p className="text-white/30 text-[12px]">
//                       or <span className="text-purple-400">click to browse</span> · MP4, MOV, AVI up to 2GB
//                     </p>
//                   </div>
//                 )}
//               </div>
//               <input
//                 id="fileInput"
//                 type="file"
//                 accept="video/*"
//                 className="hidden"
//                 onChange={(e) => { setVideoFile(e.target.files[0]); setError("") }}
//               />
//             </div>


//             {loading && (
//               <div>
//                 <div className="flex justify-between items-center mb-1.5">
//                   <span className="text-[11px] text-white/40 uppercase tracking-widest">Uploading</span>
//                   <span className="text-[11px] text-[#ff2d55] font-medium">{progress}%</span>
//                 </div>
//                 <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
//                   <div
//                     className="h-full rounded-full transition-all duration-300"
//                     style={{ width: `${progress}%`, background: "linear-gradient(90deg, #ff2d55, #ff6b8a)", boxShadow: "0 0 10px rgba(255,45,85,0.5)" }}
//                   />
//                 </div>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 rounded-[10px] text-[14px] font-medium text-white transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               style={{ background: loading ? "rgba(255,255,255,0.08)" : "#ff2d55", boxShadow: loading ? "none" : "0 4px 20px rgba(255,45,85,0.35)" }}
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg className="animate-spin" viewBox="0 0 24 24" width={16} height={16} fill="none">
//                     <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
//                     <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
//                   </svg>
//                   Uploading {progress}%
//                 </span>
//               ) : "Upload Video"}
//             </button>

//           </form>
//         </div>
//       </div>

//     </div>
//   )
// }

// export default UploadVideo