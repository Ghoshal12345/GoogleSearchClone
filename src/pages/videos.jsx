import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}
function Videos() {
    const query = useQuery().get("query");
    const API_KEY = import.meta.env.VITE_API_KEY;


    useEffect(() => {
        if (!query) return;

        fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(query)}&key=${API_KEY}&type=video`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(res => {
                console.log(res.items)
                setVideos(res.items)
            })
            .catch(error => {
                console.error("Error fetching videos:", error);
            })
    }, [query])

    function getVideoUrl(videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
    }
    function getPublishDate(publishTime) {//"publishTime": "2022-07-07T13:30:05Z"
        // const publishDate = new Date(publishTime);
        const obj = {
            '01': 'Jan',
            '02': 'Feb',
            '03': 'Mar',
            '04': 'Apr',
            '05': 'May',
            '06': 'Jun',
            '07': 'Jul',
            '08': 'Aug',
            '09': 'Sep',
            '10': 'Oct',
            '11': 'Nov',
            '12': 'Dec'
        }
        const month = publishTime.slice(5, 7);
        return `${publishTime.slice(8, 10)} ${obj[month]} ${publishTime.slice(0, 4)}`; //07 Jul 2022
    }
    const [videos, setVideos] = useState([]);
    return (
        <div className='lg:ml-60 md:ml-40 sm:ml-20 '>
            <ul>
                {videos.map((video) => {
                    return (
                        <li key={video.id.videoId} className='mb-6 max-w-2xl'>
                            <a href={getVideoUrl(video.id.videoId)} target="_blank" rel="noopener noreferrer" >
                                <cite>www.youtube.com <span> › watch </span></cite>
                                <p className="text-[#1a0dab] dark:text-[#99c3ff] cursor-pointer text-xl font-normal hover:underline p-0.5 max-w-[550px] line-clamp-1">{video.snippet.title}</p>
                            </a>
                            <div className=' flex flex-row flex-wrap '>
                                <a href={getVideoUrl(video.id.videoId)} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={video.snippet.thumbnails.medium.url}
                                        alt={video.snippet.title}
                                        className=" h-[90px] object-cover rounded-md mr-3"
                                    />

                                </a>
                                <div>
                                    <p className=' text-wrap line-clamp-2 text-sm text-[#bfbfbf] font-bold mt-2 max-w-[483px] '>{video.snippet.description}</p>
                                    <p className='mt-3'>Youtube · {video.snippet.channelTitle} · {getPublishDate(video.snippet.publishTime)}</p>
                                </div>

                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Videos
