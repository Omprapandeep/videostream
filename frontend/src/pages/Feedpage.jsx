import React, { useCallback, useEffect, useRef, useState } from 'react'
import api from "../services/api"
import VideoCard from '../components/VideoCard'
import { useSearchParams } from 'react-router-dom'
import VideoSkeleton from '../components/VideoSkeleton'

const Feed = () => {
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true); // ← first load flag
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Refs keep scroll handler fresh without re-attaching
    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);
    useEffect(() => { loadingRef.current = loading; }, [loading]);
    useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

    // Reset on search change
    useEffect(() => {
        setVideos([]);
        setPage(1);
        setHasMore(true);
        hasMoreRef.current = true;
        setInitialLoad(true);
    }, [search]);

    // Stable fetch — args instead of stale closure
    const fetchVideos = useCallback(async (currentPage, currentSearch) => {
        if (loadingRef.current) return;
        try {
            loadingRef.current = true;
            setLoading(true);
            const res = await api.get(
                `/videos/feed/subscribed?search=${currentSearch}&page=${currentPage}`
            );
            const newVideos = res.data.videos;
            if (!newVideos || newVideos.length === 0) {
                setHasMore(false);
                hasMoreRef.current = false;
            } else {
                setVideos(prev => {
                    const existingIds = new Set(prev.map(v => v._id));
                    return [...prev, ...newVideos.filter(v => !existingIds.has(v._id))];
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            loadingRef.current = false;
            setLoading(false);
            setInitialLoad(false);
        }
    }, []);

    useEffect(() => {
        fetchVideos(page, search);
    }, [page, search]);

    // ← empty deps = attach ONCE, refs handle freshness
    useEffect(() => {
        const container = document.getElementById("main-scroll");
        if (!container) return;

        const handleScroll = () => {
            if (loadingRef.current || !hasMoreRef.current) return;
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollTop + clientHeight + 150 >= scrollHeight) {
                setPage(prev => prev + 1);
            }
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, []); // ← was [loading, hasMore] — the main culprit

    const isEmpty = !initialLoad && !loading && videos.length === 0 && !hasMore;

    return (
        <div className="px-4 sm:px-6 py-6 min-h-screen">

            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <div
                    className="w-1 h-6 rounded-full shrink-0"
                    style={{ background: "linear-gradient(180deg, #22c55e, #7c3aed)" }}
                />
                <h1 className="text-white text-[18px] font-semibold tracking-tight">
                    {search
                        ? <>Results for <span style={{ color: "#a78bfa" }}>"{search}"</span></>
                        : "Subscribed Feed"
                    }
                </h1>
            </div>

            {/* Video grid — stays mounted, skeletons append below */}
            {videos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {videos.map(video => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}

            {/* First load = 8 skeletons. Paginating = 4 skeletons below grid */}
            {(initialLoad || loading) && (
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ${videos.length > 0 ? 'mt-5' : ''}`}>
                    {[...Array(initialLoad ? 8 : 4)].map((_, i) => <VideoSkeleton key={i} />)}
                </div>
            )}

            {/* Empty state */}
            {isEmpty && (
                <div className="flex flex-col items-center justify-center py-28 gap-4">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{
                            background: "rgba(124,58,237,0.10)",
                            border: "0.5px solid rgba(124,58,237,0.20)",
                        }}
                    >
                        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth={1.5}>
                            <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                        </svg>
                    </div>
                    <p className="text-white/60 text-[15px] font-medium">
                        {search ? "No videos found" : "No videos yet"}
                    </p>
                    <p className="text-white/30 text-[13px] text-center max-w-xs leading-relaxed">
                        {search
                            ? "Try a different search term"
                            : "Subscribe to channels to see their videos here"
                        }
                    </p>
                </div>
            )}

            {/* End of feed */}
            {!hasMore && videos.length > 0 && (
                <div className="flex items-center gap-3 mt-10 mb-4">
                    <hr style={{ flex: 1, border: "none", borderTop: "0.5px solid rgba(255,255,255,0.07)" }} />
                    <span className="text-[12px] text-black px-2">You're all caught up</span>
                    <hr style={{ flex: 1, border: "none", borderTop: "0.5px solid rgba(0,0,0,0.04)" }} />
                </div>
            )}

        </div>
    );
};

export default Feed;