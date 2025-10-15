import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function News() {
  const query = useQuery().get('query');
  // console.log(query);
  const [news, setNews] = useState([]);
  useEffect(() => {
    // https://newsapi.org/v2/everything?q=sonam%20wangchuk&sortBy=popularity&apiKey=360aee87752645b2b4a3439322e07b73
    const news_api_key = import.meta.env.VITE_NEWS_API_KEY;
    // https://newsapi.org/v2/everything?q=sonam%20wangchuk&sortBy=popularity&apiKey=360aee87752645b2b4a3439322e07b73
    fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=popularity&apiKey=${news_api_key}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json();
      })
      .then(data => setNews(data.articles))
      .catch((error) => console.log(`Error fetching news: ${error}`))
  }, [query])

  function getFaviconUrl(url) {
    if (!url) return null;
    try {
      const parts = url.split('/');
      const domain = parts[2];
      console.log(domain);
      return `https://www.google.com/s2/favicons?domain=${domain}`;
    } catch (e) {
      return null;
    }
  }

  return (
    <div className='lg:ml-60 md:ml-40 sm:ml-20 '>
      <ul className='max-w-auto'>
        {news.map((news) => {
          return (
            <li key={news.url} className='mb-6 max-w-2xl'>
                <a href={news.url} target="_blank" rel="noopener noreferrer">
              <div className='flex flex-row justify-between '>

                  <div className='flex flex-col gap-[2px]'>
                    <div className='flex flex-row gap-2'>
                      <img src={getFaviconUrl(news.url)} alt=""  className='h-[16px] w-[16px]'/>
                      <span>{news.source.name}</span>
                    </div>

                    <p className="text-[#1a0dab] dark:text-[#99c3ff] cursor-pointer text-xl font-normal hover:underline p-0.5 max-w-[543px] ">{news.title}</p>

                    <p className=' text-wrap line-clamp-2 text-sm text-[#bfbfbf] font-bold mt-[1px] max-w-[483px] '>{news.description}</p>
                  </div>


                  <img src={news.urlToImage} alt="" className='w-[92px] h-[92px] right-0 top-0 rounded-md' />
              </div>
                </a>
            </li>
          )
        })}
      </ul>

    </div>
  )
}

export default News
