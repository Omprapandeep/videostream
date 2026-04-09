import React, { useEffect, useState } from 'react'
import api from "../services/api"
import VideoCard from '../components/VideoCard'
import { useSearchParams } from 'react-router-dom'
import noResultImg from "../assets/noresult.jpg";
import VideoSkeleton from '../components/VideoSkeleton'

const Feed = () => {
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const [videos, setvideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // 🔥 reset when search changes
    useEffect(() => {
        setvideos([]);
        setPage(1);
        setHasMore(true);
    }, [search]);

    useEffect(() => {
        fetchvideos();
    }, [search, page]);

    const fetchvideos = async () => {
        if (!hasMore) return; // No more videos to fetch
        try {
            setLoading(true);

            const res = await api.get(`/videos/feed/subscribed?search=${search}&page=${page}`);

            if (res.data.videos.length === 0) {
                setHasMore(false); // No more videos to load
            } else {
                setvideos(prev => {
                    const newVideos = res.data.videos;

                    const unique = [
                        ...prev,
                        ...newVideos.filter(
                            v => !prev.some(p => p._id === v._id)
                        )
                    ];

                    return unique;
                });
                setPage(prev => prev + 1);
            }
        } catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    };


    //infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (!hasMore || loading) return;
            if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
                
                    setPage(prev => prev + 1); // 🔥 IMPORTANT CHANGE
                
            }
        }

        //Visible screen height
        // + scrolled distance
        // ≈ total page height
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [, hasMore, loading]);

    return (
        <div className="p-6  ">

            <h1 className="text-2xl font-semibold mb-4 text-gray-800">
                Subscribed Feed
            </h1>

            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {videos.map(video => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>

            {loading && (
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <VideoSkeleton key={i} />
                    ))}
                </div>
            )}

            {!hasMore && (
                <p className="text-center text-gray-500 mt-6">
                    No more videos
                </p>
            )}

        </div>
    )
};

export default Feed;