import React, { use } from 'react'
import api from "../services/api"
import VideoCard from '../components/VideoCard'
import { useEffect, useState,useCallback,useRef} from 'react'
import { useSearchParams } from 'react-router-dom'
import noResultImg from "../assets/noresult.jpg";
import VideoSkeleton from '../components/VideoSkeleton'


const Home = () => {

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [videos, setvideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialload,setinitialload]=useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);


  const loadingref=useRef(false);
  const hasMoreref=useRef(true);
  useEffect(() => {
    loadingref.current=loading;
  }, [loading])

  useEffect(() => {
    hasMoreref.current=hasMore;
  }, [hasMore])

  useEffect(() => {
    setvideos([]);
    setPage(1);
    setHasMore(true);
    hasMoreref.current=true;
    setinitialload(true);
  }, [search]);

  const fetchvideos =useCallback( async (currentpage,currentsearch) => {
    if(loadingref.current || !hasMoreref.current) return;
    try {
      loadingref.current=true;
      setLoading(true);
      const res = await api.get(`/videos/all?search=${currentsearch}&page=${currentpage}`);
      const newVideos = res.data.videos;

      if (!newVideos || newVideos.length === 0) {
        setHasMore(false);
        hasMoreref.current=false;
      } else {
        setvideos(prev => {
          const existingIds = new Set(prev.map(v => v._id));
          return [...prev, ...newVideos.filter(v => !existingIds.has(v._id))];
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      loadingref.current=false;
      setinitialload(false);
    }
  },[]);

 useEffect(() => {
    fetchvideos(page, search);
  }, [page, search]);
  

  useEffect(() => {
        const container = document.getElementById("main-scroll");
        if (!container) return;

        const handleScroll = () => {
            if (loadingref.current || !hasMoreref.current) return;
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollTop + clientHeight + 200 >= scrollHeight) {
                setPage(prev => prev + 1); // triggers fetchVideos via useEffect
            }
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);
 
  const isEmpty = !initialload && !loading && videos.length === 0 && !hasMore;

  return (
    <div >

      {isEmpty && (
        <div className="bg-black h-[calc(100vh-66.5px)] flex flex-col items-center justify-center text-center">
          <img src={noResultImg} alt="No results" className="w-52 rounded-2xl mb-6 select-none" />
          <h2 className="text-xl font-semibold text-gray-700">No videos found</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-md">
            We couldn't find any videos matching <span className="font-medium">"{search}"</span>.
          </p>
        </div>
      )}
  

        {/* Grid stays mounted — skeletons append BELOW, never replace */}
      {videos.length > 0 && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map(video => <VideoCard key={video._id} video={video} />)}
        </div>
      )}
      
      
       {/* First load = 8 skeletons full page. Paginating = 4 skeletons below grid */}
      {(initialload || loading) && (
        <div className={`p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${videos.length > 0 ? 'pt-0' : ''}`}>
          {[...Array(initialload ? 8 : 4)].map((_, i) => <VideoSkeleton key={i} />)}
        </div>
      )}

      {!hasMore && videos.length > 0 && (
        <div className="flex items-center gap-3 px-6 mt-4 mb-6">
          <hr style={{ flex: 1, border: "none", borderTop: "0.5px solid rgba(0,0,0,0.1)" }} />
          <span className="text-[12px] text-gray-400 px-2">You're all caught up</span>
          <hr style={{ flex: 1, border: "none", borderTop: "0.5px solid rgba(0,0,0,0.1)" }} />
        </div>
      )}

    



    </div >


  )
}

export default Home
