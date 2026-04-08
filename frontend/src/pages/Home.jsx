import React from 'react'
import api from "../services/api"
import VideoCard from '../components/VideoCard'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import noResultImg from "../assets/noresult.jpg";
import VideoSkeleton from '../components/VideoSkeleton'

const Home = () => {

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [videos, setvideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchvideos();
  }, [search]);

  const fetchvideos = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/videos/all?search=${search}`);
      setvideos(res.data.videos);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }


  return (



    <div >
      {loading ? (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
      )
        : videos.length === 0 ? (

          <div className="bg-black h-[calc(100vh-67px)]  flex flex-col items-center justify-center  text-center">

            {/* Illustration */}
            <img
              src={noResultImg}
              alt="No results"
              className="w-52 opacity-100 rounded-2xl mb-6 select-none"
            />

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-700">
              No videos found
            </h2>

            {/* Description */}
            <p className="text-gray-500 text-sm mt-2 max-w-md">
              We couldn't find any videos matching
              <span className="font-medium"> "{search}"</span>.
              Try searching for something else.
            </p>

          </div>

        ) : (
          <div className='p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {
              videos.map((video) => {
                return <VideoCard key={video._id} video={video} />
              })
            }
          </div>
        )

      }



    </div >


  )
}

export default Home
