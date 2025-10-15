import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
function useQuery() {
  return new URLSearchParams(useLocation().search);//custom hook to get query params in string format like "?query=react%20hook%20tutorial"
}

function AllResults() {
  const query = useQuery().get("query");//get the value from url to standard input like react hook tutorial
  // console.log(query);
  const [result, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    // It's better to store keys in environment variables
    const API_KEY = import.meta.env.VITE_API_KEY;
    const CX_KEY = import.meta.env.VITE_CX_KEY;

    fetch(
      `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX_KEY}&q=${encodeURIComponent(query)}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        // console.log(res.items)
        setResults(res.items)
      })
      .catch((error) => {
        console.error("Error fetching web results:", error);
      })
  }, [query]);

  function getFaviconUrl(displayLink) {
    if (!displayLink) return null;
    try {
      // const urlObj = new URL(url);
      // const hostname = urlObj.hostname;
      return `https://www.google.com/s2/favicons?domain=${displayLink}`;
    } catch (e) {
      return null;
    }
  }

  function getWebsiteName(displayLink) {
    let domain = displayLink.replace(/^www\./, '').trim();
    console.log(domain);
    const parts = domain.split('.');
    return parts[parts.length-2] || domain;
  }
  return (
    <div>
      <div className='lg:ml-60 md:ml-40 sm:ml-20'>
        <ul className=''>
          {result.map((result) => {
            return (
              <li key={result.link} className='mb-8'>
                <div className="flex flex-row items-center mb-2">
                  <img
                    src={getFaviconUrl(result.displayLink)}
                    alt="Favicon"
                    className="h-9 w-9 object-contain rounded-full"
                  />
                  <div className="flex flex-col ml-2">
                    <span className="text-[#dadce0] text-sm font-normal">{getWebsiteName(result.displayLink)}</span>
                    <cite className="text-[#bdc1c6] text-xs font-normal">{result.displayLink}</cite>
                  </div>
                </div>
                <a
                  href={result.link} I
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1a0dab] dark:text-[#99c3ff] cursor-pointer text-xl font-normal hover:underline p-0.5"
                >
                  {result.title}
                </a>
                <p className='max-w-2xl text-wrap line-clamp-2 text-sm text-[#bfbfbf] font-bold mt-2'>{result.snippet}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default AllResults;