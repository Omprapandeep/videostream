import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 }
  ];
  for (let i = 0; i < intervals.length; i++) {
    const interval = Math.floor(seconds / intervals[i].seconds);
    if (interval >= 1) return interval + " " + intervals[i].label + (interval > 1 ? "s" : "") + " ago";
  }
  return "Just now";
};

const VideoPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [comments, setcomments] = useState([]);
  const [commenttext, setcommenttext] = useState("");
  const [likes, setlikes] = useState(0);
  const [subscribed, setsubscribed] = useState(false);
  const [subcount, setsubcount] = useState(0);
  const [subloading, setsubloading] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  useEffect(() => {
    fetchVideo();
    fetchRecommended();
    fetchcomments();
    fetchlikes();
  }, [id]);

  useEffect(() => {
    if (video?.owner?._id) fetchsubscription();
  }, [video]);

  const fetchcomments = async () => {
    try {
      const res = await api.get(`/comments/${id}/get`);
      setcomments(res.data.comments);
    } catch (err) { console.log(err); }
  };

  const fetchVideo = async () => {
    try {
      const viewedKey = `viewed_${id}`;
      const alreadyViewed = sessionStorage.getItem(viewedKey);
      const res = await api.get(`/videos/${id}?increment=${!alreadyViewed}`);
      setVideo(res.data);
      if (!alreadyViewed) sessionStorage.setItem(viewedKey, "true");
    } catch (err) { console.log(err); }
  };

  const fetchRecommended = async () => {
    try {
      const res = await api.get("/videos/all");
      setRecommended(res.data.videos);
    } catch (err) { console.log(err); }
  };

  const fetchlikes = async () => {
    try {
      const res = await api.get(`/likes/${id}/count`);
      setlikes(res.data.likes);
    } catch (err) { console.log(err); }
  };

  const fetchsubscription = async () => {
    try {
      if (!video?.owner?._id) return;
      const videownerId = video.owner._id;
      const res1 = await api.get(`/subscriptions/subscribers/${videownerId}`);
      setsubcount(res1.data.subscribers);
      const token = localStorage.getItem("token");
      if (token) {
        const res2 = await api.get(`/subscriptions/${videownerId}/status`);
        setsubscribed(res2.data.subscribed);
      }
    } catch (err) { console.log("Failed to fetch subscription status", err); }
  };

  const handleaddcomments = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    if (!commenttext.trim()) return;
    try {
      await api.post(`/comments/${id}/add`, { content: commenttext });
      setcommenttext("");
      fetchcomments();
    } catch (err) { console.log(err); }
  };

  const handlelike = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    try {
      await api.post(`/likes/${id}/toggle`);
      fetchlikes();
    } catch (err) { console.log(err); }
  };

  const handlesubscribe = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    if (subloading) return;
    try {
      setsubloading(true);
      const res = await api.post(`/subscriptions/${video.owner._id}`);
      setsubscribed(res.data.subscribed);
      setsubcount(prev => res.data.subscribed ? prev + 1 : prev - 1);
    } catch (err) { console.log("Failed to toggle subscription", err); }
    finally { setsubloading(false); }
  };

  if (!video) return (
    <div className="flex justify-center items-center h-screen bg-[#0a0a0f]">
      <div className="w-11 h-11 rounded-full animate-spin"
        style={{ border: "2px solid rgba(124,58,237,0.15)", borderTopColor: "#7c3aed" }} />
    </div>
  );

  // ── Shared: channel + actions bar ──
  const channelBar = (
    <div
      className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-base cursor-pointer shrink-0"
          style={{ background: "linear-gradient(135deg, #7c3aed, #22c55e)" }}
          onClick={() => navigate(`/channel/${video.owner._id}`)}
        >
          {video.owner?.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p
            className="text-white font-semibold text-sm cursor-pointer hover:text-purple-400 transition-colors"
            onClick={() => navigate(`/channel/${video.owner._id}`)}
          >
            {video.owner?.username}
          </p>
          <p className="text-white/40 text-xs mt-0.5">{subcount} subscribers</p>
        </div>
        <button
          onClick={e => { e.stopPropagation(); handlesubscribe(); }}
          disabled={subloading}
          className="ml-1 px-4 py-1.5 text-[13px] font-medium rounded-full cursor-pointer transition-all duration-200 disabled:opacity-50"
          style={subscribed ? {
            background: "rgba(255,255,255,0.08)",
            border: "0.5px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.55)",
          } : {
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            boxShadow: "0 2px 16px rgba(124,58,237,0.35)",
            color: "#fff", border: "none",
          }}
        >
          {subloading ? "..." : subscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      <button
        onClick={handlelike}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-all duration-200 active:scale-95"
        style={{ background: "rgba(124,58,237,0.12)", border: "0.5px solid rgba(124,58,237,0.28)", color: "#c4b5fd" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.22)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(124,58,237,0.12)"}
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="#a78bfa">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span>{likes}</span>
      </button>
    </div>
  );

  // ── Shared: comments section ──
  const commentsSection = (
    <div className="flex flex-col gap-5">
      <h2 className="text-white font-semibold text-base">{comments.length} Comments</h2>

      {/* Add comment */}
      <div className="flex gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0"
          style={{ background: "linear-gradient(135deg, #7c3aed, #22c55e)" }}
        >U</div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commenttext}
            onChange={e => setcommenttext(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleaddcomments(); }}
            className="w-full py-2 text-sm text-white bg-transparent outline-none placeholder-white/25"
            style={{ borderBottom: "0.5px solid rgba(255,255,255,0.15)" }}
            onFocus={e => e.target.style.borderBottomColor = "rgba(124,58,237,0.60)"}
            onBlur={e => e.target.style.borderBottomColor = "rgba(255,255,255,0.15)"}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleaddcomments}
              className="px-4 py-1.5 rounded-full text-[13px] font-medium text-white cursor-pointer transition-all hover:opacity-85"
              style={{ background: "linear-gradient(135deg, #7c3aed, #22c55e)", boxShadow: "0 2px 12px rgba(124,58,237,0.28)" }}
            >Comment</button>
          </div>
        </div>
      </div>

      {/* Comment list */}
      <div className="flex flex-col gap-4">
        {comments.map(comm => (
          <div key={comm._id} className="flex gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white text-sm shrink-0"
              style={{ background: "rgba(124,58,237,0.25)" }}
            >
              {comm.owner?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">
                {comm.owner?.username}
                <span className="text-white/30 text-xs ml-2 font-normal">{timeAgo(comm.createdAt)}</span>
              </p>
              <p className="text-sm text-white/55 mt-1 leading-relaxed">{comm.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const handlerecommend = () => {
    setCommentsOpen(false);
    setcommenttext("");
  }

  // ── Shared: recommended list ──
  const recommendedList = (
    <div className="flex flex-col gap-3">
      <p className="text-white/40 text-[11px] uppercase tracking-widest font-medium px-1">Up next</p>
      {recommended.map(vid => (
        <Link
          key={vid._id}
          to={`/video/${vid._id}`}
          onClick={handlerecommend}
          className="flex gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 group no-underline"
          style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(124,58,237,0.10)" }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(124,58,237,0.08)";
            e.currentTarget.style.borderColor = "rgba(124,58,237,0.28)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            e.currentTarget.style.borderColor = "rgba(124,58,237,0.10)";
          }}
        >
          <div className="w-36 h-20.5 rounded-lg overflow-hidden shrink-0 bg-black">
            <img
              src={vid.thumbnailUrl}
              alt={vid.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center gap-1 min-w-0">
            <p className="text-white/85 text-[13px] font-medium leading-snug line-clamp-2">{vid.title}</p>
            <p className="text-white/40 text-[11px] truncate">{vid.owner?.username}</p>
            <p className="text-white/30 text-[11px]">{vid.views} views • {timeAgo(vid.createdAt)}</p>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="bg-[#0a0a0f] w-full" style={{ height: "calc(100vh - 66.4px)", overflow: "hidden" }}>

      {/* ════════════════════════
           DESKTOP (lg+)
          ════════════════════════ */}
      <div className="hidden lg:flex h-full gap-5 px-6 py-4">

        {/* Left — independent scroll */}
        <div className="flex-1 min-w-0 overflow-y-auto custom-scrollbar pb-10 pr-2 flex flex-col gap-4">

          {/* Player */}
          <div
            className="w-full aspect-video rounded-2xl overflow-hidden bg-black shrink-0"
            style={{ border: "0.5px solid rgba(124,58,237,0.20)", boxShadow: "0 0 40px rgba(124,58,237,0.10)" }}
          >
            <video src={video.videoUrl} controls className="w-full h-full object-contain" />
          </div>

          {/* Title */}
          <h1 className="text-white text-xl font-semibold leading-snug">{video.title}</h1>

          {/* Views */}
          <p className="text-white/40 text-sm -mt-2">{video.views} views • {timeAgo(video.createdAt)}</p>

          {/* Channel bar */}
          {channelBar}

          {/* Description */}
          {video.description && (
            <div
              className="p-4 rounded-xl text-sm text-white/55 leading-relaxed"
              style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}
            >
              {video.description}
            </div>
          )}

          {/* Comments always visible on desktop */}
          {commentsSection}
        </div>

        {/* Right — independent scroll */}
        <div className="w-85 shrink-0 overflow-y-auto custom-scrollbar pb-10">
          {recommendedList}
        </div>
      </div>

      {/* ════════════════════════
           MOBILE (< lg)
           Single outer scroll
          ════════════════════════ */}
      <div className="lg:hidden h-full overflow-y-auto custom-scrollbar">
        <div className="px-3 py-4 pb-12 flex flex-col gap-4">

          {/* Player */}
          <div
            className="w-full aspect-video rounded-2xl overflow-hidden bg-black shrink-0"
            style={{ border: "0.5px solid rgba(124,58,237,0.20)", boxShadow: "0 0 24px rgba(124,58,237,0.10)" }}
          >
            <video src={video.videoUrl} controls className="w-full h-full object-contain" />
          </div>

          {/* Title */}
          <h1 className="text-white text-lg font-semibold leading-snug">{video.title}</h1>

          {/* Views */}
          <p className="text-white/40 text-sm -mt-2">{video.views} views • {timeAgo(video.createdAt)}</p>

          {/* Channel bar */}
          {channelBar}

          {/* Description */}
          {video.description && (
            <div
              className="p-3.5 rounded-xl text-sm text-white/55 leading-relaxed"
              style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}
            >
              {video.description}
            </div>
          )}

          {/* ── Comments toggle ── */}
          <button
            onClick={() => setCommentsOpen(p => !p)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all"
            style={{ background: "rgba(124,58,237,0.10)", border: "0.5px solid rgba(124,58,237,0.25)" }}
          >
            <span className="text-white/80 text-sm font-medium">💬 {comments.length} Comments</span>
            <svg
              width={16} height={16} viewBox="0 0 24 24"
              fill="none" stroke="#a78bfa" strokeWidth={2}
              style={{ transform: commentsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Collapsible comments */}
          {commentsOpen && (
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)" }}
            >
              {commentsSection}
            </div>
          )}

          {/* Recommended — always below comments toggle */}
          {recommendedList}

        </div>
      </div>

    </div>
  );
};

export default VideoPage;


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";


// const timeAgo = (date) => {
//   const seconds = Math.floor((new Date() - new Date(date)) / 1000);

//   const intervals = [
//     { label: "year", seconds: 31536000 },
//     { label: "month", seconds: 2592000 },
//     { label: "day", seconds: 86400 },
//     { label: "hour", seconds: 3600 },
//     { label: "minute", seconds: 60 }
//   ];

//   for (let i = 0; i < intervals.length; i++) {
//     const interval = Math.floor(seconds / intervals[i].seconds);
//     if (interval >= 1) {
//       return interval + " " + intervals[i].label + (interval > 1 ? "s" : "") + " ago";
//     }
//   }

//   return "Just now";
// };

// const VideoPage = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [video, setVideo] = useState(null);
//   const [recommended, setRecommended] = useState([]);

//   const [comments, setcomments] = useState([]);
//   const [commenttext, setcommenttext] = useState("");

//   const [likes, setlikes] = useState(0);
//   const [subscribed, setsubscribed] = useState(false);
//   const [subcount, setsubcount] = useState(0);
//   const [subloading, setsubloading] = useState(false);
//   const [commentOpen, setcommentOpen] = useState(false);

//   useEffect(() => {
//     fetchVideo();
//     fetchRecommended();
//     fetchcomments();
//     fetchlikes();
//   }, [id]);

//   useEffect(() => {
//     if (video?.owner?._id) {
//       fetchsubscription();
//     }
//   }, [video]);

//   //comment fetch .

//   const fetchcomments = async () => {
//     try {
//       const res = await api.get(`/comments/${id}/get`);
//       setcomments(res.data.comments);

//     } catch (err) {
//       console.log(err);
//     }
//   }

//   //fetch single video

//   const fetchVideo = async () => {
//     try {
//       const viewedKey = `viewed_${id}`;
//       const alreadyViewed = sessionStorage.getItem(viewedKey);

//       const res = await api.get(
//         `/videos/${id}?increment=${!alreadyViewed}`
//       );

//       setVideo(res.data);

//       // mark as viewed
//       if (!alreadyViewed) {
//         sessionStorage.setItem(viewedKey, "true");
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // fetch other videos
//   const fetchRecommended = async () => {
//     try {
//       const res = await api.get("/videos/all");
//       setRecommended(res.data.videos);
//     } catch (err) {
//       console.log(err);
//     }
//   };


//   //fetch likes

//   const fetchlikes = async () => {
//     try {
//       const res = await api.get(`/likes/${id}/count`);
//       setlikes(res.data.likes);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   //fetch subscribe status and count

//   const fetchsubscription = async () => {
//     try {
//       if (!video?.owner?._id) return;
//       //
//       const videownerId = video.owner._id;
//       //getcount 
//       const res1 = await api.get(`/subscriptions/subscribers/${videownerId}`);

//       setsubcount(res1.data.subscribers);

//       //get status 
//       const token = localStorage.getItem("token");
//       if (token) {
//         const res2 = await api.get(`/subscriptions/${videownerId}/status`);
//         setsubscribed(res2.data.subscribed);
//       }

//     } catch (err) {
//       console.log("Failed to fetch subscription status", err);
//     }
//   };


//   //handle  add comments 

//   const handleaddcomments = async () => {

//     const token = localStorage.getItem("token");

//     // If user not logged in → redirect
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     if (!commenttext.trim()) return;

//     try {
//       await api.post(`/comments/${id}/add`, {
//         content: commenttext
//       });

//       setcommenttext("");

//       fetchcomments();

//     } catch (err) {
//       console.log(err);
//     }
//   }


//   //like handle
//   const handlelike = async () => {

//     const token = localStorage.getItem("token");

//     // If user not logged in → redirect
//     if (!token) {
//       navigate("/login");
//       return;
//     }


//     try {

//       const res = await api.post(`/likes/${id}/toggle`);

//       // refresh like count
//       fetchlikes();

//     } catch (err) {
//       console.log(err);
//     }
//   }

//   const handlesubscribe = async () => {
//     const token = localStorage.getItem("token");
//     // If user not logged in → redirect
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     if (subloading) return;

//     try {
//       setsubloading(true);

//       const res = await api.post(`/subscriptions/${video.owner._id}`)
//       setsubscribed(res.data.subscribed);

//       //instant update sub count based on action
//       setsubcount(prev => res.data.subscribed ? prev + 1 : prev - 1);

//     } catch (err) {
//       console.log("Failed to toggle subscription", err);
//     } finally {
//       setsubloading(false);
//     }

//   }

//   if (!video)
//     return (
//       <div className="flex justify-center items-center h-screen bg-[#0a0a0f]">

//         <div className="w-11 h-11 rounded-full animate-spin"
//           style={{ border: "2px solid rgba(124,58,237,0.15)", borderTopColor: "#7c3aed" }} />

//       </div>
//     );

//     //shared channel+ action bar --

//     const channelbar = (
//       <div className=" flex flex-wrap items-center justify-between gap-3  p-3 sm:p-4 rounded-2xl "
//       style={{background: "rgba(255,255,255,0.03" , border:"0.5px  solid rgba(255,255,255,0.07)"}}
//       >
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-base cursor-pointer shrink-0"
//             style={{background: "linear-gradient(135deg,#7c3aed,#22c55e"}}
//             onClick={() => navigate(`/channel/${video.owner._id}`)}
//           >
//             {video.owner?.username?.charAt(0).toUpperCase()}
//           </div>
         
//          <div>
//           <p className="text-white font-semibold text-sm cursor-pointer hover:text-purple-400 transition-colors" 
//           onClick={()=>navigate(`/channel/${video.owner._id}`)}>
//             {video.owner?.username}
//           </p>
//           <p className="text-white/40 text-xs mt-0.5">{subcount} subscribers</p>
//          </div>

//          <button 
//          onClick={e =>{e.stopPropagation(); handlesubscribe(); }}
//          disabled={subloading}
//          className="ml-1 px-4 py-1.5 text-[13px] font-medium rounded-full cursor-pointer transition all duration-200 disabled:opacity-50"
//          style={
//           subscribed?{
//             background:"rgba(255,255,255,0.08)",
//             border: "0.5px solid rgba(255,255,255,0.15)",
//             color: "rgba(255,255,255,0.55)",
//           }:{
//              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
//             boxShadow: "0 2px 16px rgba(124,58,237,0.35)",
//             color: "#fff", border: "none",
//           }
//          }
//          >
//           {subloading?"....":subscribed?"Subscribed":"Subscribe"}
//          </button>
         
//         </div>

//       </div>
//     )

   

//   return (

//     <div className="h-[calc(100vh-66.4px)] overflow-hidden bg-gray-100 px-6 lg:px-6 py-3">
//       <div className="max-w-10xl mx-auto h-full grid grid-cols-1 lg:grid-cols-3 gap-6">

//         {/* LEFT SIDE - VIDEO */}
//         <div className="lg:col-span-2 overflow-y-auto pr-2 custom-scrollbar pb-8">

//           {/* 🎬 Video Player */}
//           <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg">
//             <video
//               src={video.videoUrl}
//               controls
//               className="w-full h-full object-contain"
//             />
//           </div>

//           {/* 📝 Title */}
//           <h1 className="text-2xl font-semibold mt-4 leading-snug">
//             {video.title}
//           </h1>

//           {/* 📊 Views */}
//           <p className="text-sm text-gray-500 mt-1">
//             {video.views} views • {timeAgo(video.createdAt)}
//           </p>

//           {/* 🔥 Channel + Actions */}
//           <div className="flex items-center justify-between mt-5">

//             {/* LEFT: Channel Info */}
//             <div className="flex items-center gap-5">

//               {/* Avatar */}
//               <div
//                 className="w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center font-bold text-lg cursor-pointer"
//                 onClick={() => navigate(`/channel/${video.owner._id}`)}
//               >
//                 {video.owner?.username?.charAt(0).toUpperCase()}
//               </div>

//               {/* Name + Subs */}
//               <div>
//                 <p
//                   className="font-semibold cursor-pointer hover:underline"
//                   onClick={() => navigate(`/channel/${video.owner._id}`)}
//                 >
//                   {video.owner?.username}
//                 </p>

//                 <p className="text-xs text-gray-500">
//                   {subcount} subscribers
//                 </p>
//               </div>

//               {/* 🔴 Subscribe Button */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handlesubscribe();
//                 }}
//                 disabled={subloading}
//                 className={`ml-4 px-5 py-2 text-sm cursor-pointer font-medium rounded-full transition ${subscribed
//                   ? "bg-gray-200 text-black"
//                   : "bg-red-600 hover:bg-red-700 text-white"
//                   } ${subloading && "opacity-50 cursor-not-allowed"}`}
//               >
//                 {subloading
//                   ? ""
//                   : subscribed
//                     ? "Subscribed"
//                     : "Subscribe"}
//               </button>

//             </div>

//             {/* RIGHT: Like Button */}
//             <button
//               onClick={handlelike}
//               className="flex cursor-pointer items-center gap-2 px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition active:scale-95"
//             >
//               <span className="text-lg">👍</span>
//               <span className="text-sm font-medium">{likes}</span>
//             </button>

//           </div>

//           {/* 📄 Description */}
//           {video.description && (
//             <div className="mt-5 bg-gray-100 p-4 rounded-xl text-sm text-gray-800">
//               {video.description}
//             </div>
//           )}

//           {/* 💬 Comments */}
//           <div className="mt-10">

//             {/* Header */}
//             <h2 className="text-lg font-semibold mb-4">
//               {comments.length} Comments
//             </h2>

//             {/* Add Comment */}
//             <div className="flex gap-3 mb-6">

//               <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700">
//                 U
//               </div>

//               <div className="flex-1">

//                 <input
//                   type="text"
//                   placeholder="Add a comment..."
//                   value={commenttext}
//                   onChange={(e) => setcommenttext(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") handleaddcomments();
//                   }}
//                   className="w-full border-b border-gray-300 focus:border-black outline-none py-2 text-sm bg-transparent"
//                 />

//                 <div className="flex justify-end mt-2">
//                   <button
//                     onClick={handleaddcomments}
//                     className="cursor-pointer bg-black text-white px-4 py-1.5 rounded-full text-sm hover:bg-gray-800 transition"
//                   >
//                     Comment
//                   </button>
//                 </div>

//               </div>

//             </div>

//             {/* Comment List */}
//             <div className="space-y-5">

//               {comments.map((comm) => (

//                 <div key={comm._id} className="flex gap-3">

//                   {/* Avatar */}
//                   <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
//                     {comm.owner?.username?.charAt(0).toUpperCase()}
//                   </div>

//                   {/* Content */}
//                   <div>

//                     <p className="text-sm font-medium">
//                       {comm.owner?.username}
//                       <span className="text-gray-500 text-xs ml-2">
//                         {timeAgo(comm.createdAt)}
//                       </span>
//                     </p>

//                     <p className="text-sm text-gray-700 mt-1">
//                       {comm.content}
//                     </p>

//                   </div>

//                 </div>

//               ))}

//             </div>

//           </div>

//         </div>

//         {/* RIGHT SIDE - RECOMMENDED VIDEOS */}
//         <div className="overflow-y-auto custom-scrollbar pr-2 space-y-4">
//           {recommended.map((vid) => (

//             <Link
//               key={vid._id}
//               to={`/video/${vid._id}`}
//               className="flex gap-3 rounded-xl transition duration-200 cursor-pointer hover:bg-gray-100 p-2 bg-white shadow-sm"
//             >

//               <img
//                 src={vid.thumbnailUrl}
//                 className="w-40 h-24 object-cover rounded-lg"
//               />

//               <div className="text-sm">
//                 <p className="font-medium line-clamp-2">
//                   {vid.title}
//                 </p>

//                 <p className="text-gray-500 text-xs">
//                   {vid.owner?.username}
//                 </p>

//                 <p className="text-gray-500 text-xs">
//                   {vid.views} views • {timeAgo(vid.createdAt)}
//                 </p>
//               </div>

//             </Link>

//           ))}

//         </div>


//       </div>
//     </div>



//   );
// };

// export default VideoPage;