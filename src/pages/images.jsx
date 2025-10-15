import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function Images() {
  const query = useQuery().get("query");

  // It's better to store keys in environment variables
  const API_KEY = import.meta.env.VITE_API_KEY;
  const CX_KEY = import.meta.env.VITE_CX_KEY;

  const [images, setImages] = useState([]);
  useEffect(() => {
    if(!query) return;
    const base_url=`https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX_KEY}&q=${encodeURIComponent(query)}&searchType=image`;

    Promise.all([
      fetch(`${base_url}&start=1`).then(res=> res.json()),
      fetch(`${base_url}&start=11`).then(res=> res.json()),
      fetch(`${base_url}&start=21`).then(res=> res.json())
    ])
    .then(([res1, res2,res3])=>{
      const validImages1 = res1.items.filter(
        item => item.link && item.image && item.image.thumbnailLink && item.mime && item.mime.startsWith("image/") &&
    /\.(jpg|jpeg|png|webp)$/i.test(item.link)
  );
      const validImages2 = res2.items.filter(
        item => item.link && item.image && item.image.thumbnailLink && item.mime && item.mime.startsWith("image/") &&
    /\.(jpg|jpeg|png|webp)$/i.test(item.link)
      );
      const validImages3 = res3.items.filter(
        item => item.link && item.image && item.image.thumbnailLink && item.mime && item.mime.startsWith("image/") &&
    /\.(jpg|jpeg|png|webp)$/i.test(item.link)
      );
      setImages([...validImages1, ...validImages2,...validImages3]);
    })
    .catch(error => {
      console.error("Error fetching images:", error);
      setImages([]);
    })
  },[query, API_KEY, CX_KEY])

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

  <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-5 p-4">
  {images.map(image => (
    <div key={image.link} className="mb-4 break-inside-avoid">
      <a href={image.image.contextLink} target="_blank" rel="noopener noreferrer">
        <img
          src={image.link || image.image.thumbnailLink}
          alt={image.title || "Image result"}
          className="w-auto max-h-[400px] rounded-2xl mb-4 hover:scale-105 transition-transform duration-300"
        />
        <div className='flex flex-col '>
          <span className='flex flex-row items-center gap-1'>
            <img
              src={getFaviconUrl(image.displayLink)}
              alt="Favicon"
              className="h-3 w-3 object-contain  "
            />
            <span className='text-[12px] font-[400px] text-[#9e9e9e]'>{getWebsiteName(image.displayLink)}</span>
          </span>
        
        <p className="text-[14px] font-[400px] text-[#bfbfbf] line-clamp-1">{image.title}</p>
        </div>
      </a>
      
    </div>
  ))}
</div>

  )
}

export default Images;



// this will alternative of 20 images in one fetch but the problem is it renders two times . so the best approach is using promise.all
    // useEffect(() => {
    //   if (!query) return;
  
    //   fetch(`https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX_KEY}&q=${encodeURIComponent(query)}&searchType=image&start=1`)
    //     .then(res => {
    //       if (!res.ok) {
    //         throw new Error(`HTTP error! status: ${res.status}`);
    //       }
    //       return res.json();
    //     })
    //     .then(data => {
    //       if (data.items) {
    //         const validImages = data.items.filter(
    //           item => item.link && item.image && item.image.thumbnailLink
    //         );
    //         setImages(validImages);
    //       } else {
    //         setImages([]);
    //       }
    //     })
  
    //     .catch(error => {
    //       console.error("Error fetching images:", error);
    //       setImages([]);
    //     });
    //   fetch(`https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX_KEY}&q=${encodeURIComponent(query)}&searchType=image&start=11`)
    //     .then(res => {
    //       if (!res.ok) {
    //         throw new Error(`HTTP error! status: ${res.status}`);
    //       }
    //       return res.json();
    //     })
    //     .then(data => {
    //       if (data.items) {
    //         const validImages = data.items.filter(
    //           item => item.link && item.image && item.image.thumbnailLink
    //         );
    //         setImages(prevImages => [...prevImages, ...validImages]);
    //         // setImages(validImages);//do something here to append to existing images
    //       } else {
    //         setImages([]);
    //       }
    //     })
  
    //     .catch(error => {
    //       console.error("Error fetching images:", error);
    //       setImages([]);
    //     });
  
  
    // }, [query, API_KEY, CX_KEY]);