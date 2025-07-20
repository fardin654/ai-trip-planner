import React, { useState, useEffect } from 'react';
const unsplash = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

function HotelCardItem({ hotel }) {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel]);

  const GetPlacePhoto = async () => {
    setImageUrl("");

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
    }
  };

  return (
    <a
      href={`https://www.google.com/maps/search/${encodeURIComponent(hotel?.hotelName)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:scale-[1.02] transition-transform block w-full"
    >
      <div className='shadow rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow cursor-pointer'>
        <img
          src={imageUrl ? imageUrl : '/placeholder.jpg'}
          alt={hotel?.hotelName}
          className="w-[130px] h-[130px] rounded-xl"
        />
        <div className="flex flex-col justify-between text-center sm:text-left w-[300px] sm:w-auto overflow-hidden">
          <h2 className="font-semibold text-lg sm:w-auto">{hotel?.hotelName || 'Unnamed Hotel'}</h2>
          <h2 className="text-sm text-gray-500 mt-1 truncate sm:w-auto">📍 {hotel?.hotelAddress || 'Address unavailable'}</h2>
          <h2 className="text-sm mt-2 sm:w-auto">💵 {hotel?.price || 'Price not available'}</h2>
          <h2 className="text-sm text-yellow-600 mt-1 sm:w-auto">⭐ {hotel?.rating || 'Not Rated'}</h2>
        </div>
      </div>
    </a>
  );
}

export default HotelCardItem;
