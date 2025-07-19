import React from 'react'
import { useState, useEffect } from 'react';
const unsplash = import.meta.env.VITE_UNSPLASH_ACCESS_KEY


function PlaceCardItem({place}) {
   const [imageUrl, setImageUrl] = useState("");
   
   useEffect(() => {
     place && GetPlacePhoto();
   }, [place]);
   
   const GetPlacePhoto = async () => {
     setImageUrl("");
   
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
     }
    };
  return (
    <a
        href={`https://www.google.com/maps/search/${encodeURIComponent(place?.placeName)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-105 transition-all cursor-pointer block"
    >
    <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow cursor-pointer'>
      <img src={imageUrl?imageUrl:'/placeholder.jpg'} className='w-[130px] h-[130px] rounded-xl'/>
      <div>
        <h2 className='font-bold text-lg'>{place.placeName}</h2>
        <p className='text-sm text-gray-400'>{place.placeDetails}</p>
        <h2 className='mt-2'>🕙 {place.timeToTravel}</h2>
        {/* <Button className='bg-black text-white hover:bg-gray-800 w-[100%] h-[15%] mt-3' ><FaMapLocation /></Button> */}
      </div>
    </div>
    </a>
  )
}

export default PlaceCardItem
