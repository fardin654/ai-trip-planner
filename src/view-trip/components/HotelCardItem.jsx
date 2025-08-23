import React, { useState, useEffect } from 'react';
const unsplash = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
import { FaStar, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

function HotelCardItem({ hotel }) {
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel]);

  const GetPlacePhoto = async () => {
    setImageUrl("");
    setImageLoading(true);

    const placeName = hotel?.hotelName;
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
      href={`https://www.google.com/maps/search/${encodeURIComponent(hotel?.hotelName)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      <div className='bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row h-full'>
        <div className="relative md:w-40 h-48 md:h-auto">
          {imageLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          ) : (
            <img
              src={imageUrl || '/placeholder.jpg'}
              alt={hotel?.hotelName}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoading(false)}
            />
          )}
        </div>
        
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-lg mb-1 line-clamp-1">{hotel?.hotelName || 'Unnamed Hotel'}</h2>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <FaMapMarkerAlt className="mr-1 text-red-500" />
              <span className="line-clamp-1">{hotel?.hotelAddress || 'Address unavailable'}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FaStar className="text-yellow-500 mr-1" />
                <span className="font-medium">{hotel?.rating || 'Not Rated'}</span>
              </div>
              <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                <FaMoneyBillWave className="mr-1" />
                <span>{hotel?.price || 'Price not available'}</span>
              </div>
            </div>
            
            <div className="text-xs text-blue-600 font-medium mt-3">
              View on Google Maps →
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default HotelCardItem;
