import React from 'react'
import { useState, useEffect } from 'react';
import { FaClock, FaExternalLinkAlt } from "react-icons/fa";
const unsplash = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

function PlaceCardItem({place}) {
   const [imageUrl, setImageUrl] = useState("");
   const [imageLoading, setImageLoading] = useState(true);
   
   useEffect(() => {
     place && GetPlacePhoto();
   }, [place]);
   
   const GetPlacePhoto = async () => {
     setImageUrl("");
     setImageLoading(true);
   
     const placeName = place?.placeName;
     if (!placeName) return;
   
     try {
       const unsplashRes = await fetch(
         `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
           placeName
         )}&client_id=${unsplash}`
       );
   
       const unsplashData = await unsplashRes.json();
       const imgUrl = unsplashData?.results?.[0]?.urls?.regular;
   
       if (imgUrl) {
         setImageUrl(imgUrl);
       } else {
         console.log("No image found on Unsplash");
       }
     } catch (err) {
       console.error("Error fetching image from Unsplash:", err);
     } finally{
       setImageLoading(false);
     }
    };
  return (
    <a
      href={`https://www.google.com/maps/search/${encodeURIComponent(place?.placeName)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-all duration-300 hover:scale-[1.02] hover:shadow-lg h-full"
    >
      <div className='bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full'>
        {/* Image container with fixed aspect ratio */}
        <div className="relative h-48 w-full">
          {imageLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          ) : (
            <img 
              src={imageUrl || '/placeholder.jpg'} 
              className='w-full h-full object-cover'
              alt={place.placeName}
              onLoad={() => setImageLoading(false)}
            />
          )}
        </div>
        
        {/* Content container with flex-grow to take remaining space */}
        <div className="p-4 flex flex-col flex-grow">
          <h2 className='font-bold text-lg mb-2 line-clamp-2'>{place.placeName}</h2>
          <p className='text-gray-600 text-sm mb-4 line-clamp-3 flex-grow'>{place.placeDetails}</p>
          
          <div className="mt-auto">
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <FaClock className="mr-2 text-blue-500" />
              <span>{place.timeToTravel}</span>
            </div>
            
            <div className="flex items-center text-blue-600 text-sm font-medium">
              <FaExternalLinkAlt className="mr-1" size={12} />
              <span>View on map</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

export default PlaceCardItem