import React from 'react'
import api from "../services/api"
import VideoCard from '../components/VideoCard'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const Home = () => {

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [videos, setvideos] = useState([]);

  useEffect(() => {
    fetchvideos();
  }, [search]);

  const fetchvideos = async () => {
    try {
      const res = await api.get(`/videos/all?search=${search}`);
      setvideos(res.data.videos);
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div className='p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {
        videos.map((video) => {
          return <VideoCard key={video._id} video={video} />
        })
      }
    </div>
  )
}

export default Home
