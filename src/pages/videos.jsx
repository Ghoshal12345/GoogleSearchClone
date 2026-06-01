import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Videos() {
  const query = useQuery().get("query");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (!query) return;

    // 1. Keep environment variables scoped safely inside the effect
    const API_KEY = import.meta.env.VITE_API_KEY;

    const fetchVideos = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(query)}&key=${API_KEY}&type=video`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        
        // Defensive check: fallback to an empty array if items is undefined
        setVideos(data.items || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos([]); // Reset to empty array on catch blocks to prevent UI breaks
      }
    };

    fetchVideos();
  }, [query]);

  function getVideoUrl(videoId) {
    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : '#';
  }

  // 2. High-performance date formatting using native Intl API
  function getPublishDate(publishTime) {
    if (!publishTime) return '';
    try {
      const date = new Date(publishTime);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }); // Formats directly to: "07 Jul 2022"
    } catch (e) {
      return '';
    }
  }

  return (
    <div className='lg:ml-60 md:ml-40 sm:ml-20 p-4'>
      <ul>
        {videos.map((video, index) => {
          // 3. Fallback tracking to prevent unique key property warnings on undefined IDs
          const videoId = video?.id?.videoId;
          const currentKey = videoId ? `${videoId}-${index}` : `video-fallback-${index}`;

          return (
            <li key={currentKey} className='mb-6 max-w-2xl'>
              <a href={getVideoUrl(videoId)} target="_blank" rel="noopener noreferrer">
                <cite className="text-xs text-gray-500 block mb-1">
                  www.youtube.com <span className="text-gray-400"> › watch </span>
                </cite>
                <p className="text-[#1a0dab] dark:text-[#99c3ff] cursor-pointer text-xl font-normal hover:underline p-0.5 max-w-[550px] line-clamp-1">
                  {video?.snippet?.title}
                </p>
              </a>
              
              <div className='flex flex-row flex-wrap mt-2'>
                <a href={getVideoUrl(videoId)} target="_blank" rel="noopener noreferrer">
                  <img
                    src={video?.snippet?.thumbnails?.medium?.url}
                    alt={video?.snippet?.title || "Video thumbnail"}
                    className="h-[90px] w-[120px] object-cover rounded-md mr-3"
                  />
                </a>
                <div className="flex-1 min-w-[200px]">
                  <p className='text-wrap line-clamp-2 text-sm text-[#bfbfbf] font-bold max-w-[483px]'>
                    {video?.snippet?.description}
                  </p>
                  <p className='mt-3 text-xs text-gray-400'>
                    YouTube · {video?.snippet?.channelTitle} · {getPublishDate(video?.snippet?.publishTime)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Videos;
