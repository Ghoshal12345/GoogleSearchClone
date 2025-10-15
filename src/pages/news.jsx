import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function News() {
  const query = useQuery().get('query');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError(null);

    // Use Guardian API for both development and production
    const isDevelopment = import.meta.env.DEV;
    
    let fetchUrl;
    if (isDevelopment) {
      // Development - use direct Guardian API call
      const guardian_api_key = import.meta.env.VITE_GUARDIAN_API_KEY;
      fetchUrl = `https://content.guardianapis.com/search?q=${encodeURIComponent(query)}&api-key=${guardian_api_key}&show-fields=thumbnail,headline,trailText,bodyText&page-size=10&order-by=relevance`;
    } else {
      // Production - use serverless function
      fetchUrl = `/api/news?query=${encodeURIComponent(query)}`;
    }

    fetch(fetchUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json();
      })
      .then(data => {
        if (isDevelopment) {
          // Transform Guardian API response for development
          const transformedArticles = data.response?.results?.map(item => ({
            title: item.webTitle,
            description: item.fields?.trailText || item.fields?.bodyText?.substring(0, 200) + '...' || 'No description available',
            url: item.webUrl,
            urlToImage: item.fields?.thumbnail || 'https://via.placeholder.com/92x92?text=No+Image',
            source: {
              name: 'The Guardian'
            },
            publishedAt: item.webPublicationDate
          })) || [];
          setNews(transformedArticles);
        } else {
          // Production - data is already transformed by serverless function
          setNews(data.articles || []);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(`Error fetching news: ${error}`);
        setError(error.message);
        setNews([]);
        setLoading(false);
      })
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
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading news...</div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center py-8">
          <div className="text-lg text-red-600 dark:text-red-400">
            Error loading news: {error}
          </div>
        </div>
      )}
      
      {!loading && !error && news.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="text-lg text-gray-600 dark:text-gray-300">
            No news articles found for "{query}"
          </div>
        </div>
      )}

      <ul className='max-w-auto'>
        {news.map((newsItem, index) => {
          return (
            <li key={newsItem.url || index} className='mb-6 max-w-2xl'>
                <a href={newsItem.url} target="_blank" rel="noopener noreferrer">
              <div className='flex flex-row justify-between '>

                  <div className='flex flex-col gap-[2px]'>
                    <div className='flex flex-row gap-2'>
                      <img src={getFaviconUrl(newsItem.url)} alt=""  className='h-[16px] w-[16px]'/>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{newsItem.source.name}</span>
                    </div>

                    <p className="text-[#1a0dab] dark:text-[#99c3ff] cursor-pointer text-xl font-normal hover:underline p-0.5 max-w-[543px] ">{newsItem.title}</p>

                    <p className=' text-wrap line-clamp-2 text-sm text-[#bfbfbf] font-bold mt-[1px] max-w-[483px] '>{newsItem.description}</p>
                  </div>

                  {newsItem.urlToImage && (
                    <img 
                      src={newsItem.urlToImage} 
                      alt={newsItem.title} 
                      className='w-[92px] h-[92px] right-0 top-0 rounded-md object-cover' 
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
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
